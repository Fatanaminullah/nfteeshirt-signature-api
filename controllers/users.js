"use strict";

const users = require("../models").users;
const response = require("../components/response");
const jwt = require("jsonwebtoken");
const { bufferToHex } = require("ethereumjs-util");
const { recoverPersonalSignature } = require("eth-sig-util");
const { config } = require("../middlewares/jwt");
const { getOwnerOf } = require("../components/contract");

exports.signIn = (req, res) => {
  const { wallet_address } = req.query;
  users
    .findOne({
      where: { wallet_address },
    })
    .then((result) => {
      response.res200(res, result);
    })
    .catch((err) => {
      return response.res500(res, JSON.stringify(err.message));
    });
};

exports.signUp = (req, res) => {
  const { wallet_address } = req.body;
  const address = wallet_address.toLowerCase();
  users
    .findOrCreate({
      where: {
        wallet_address: address,
      },
      defaults: {
        wallet_address: address,
      },
    })
    .then((result) => {
      return response.res200(res, result[0]);
    })
    .catch((error) => {
      return response.res500(res, JSON.stringify(error));
    });
};

exports.signatureVerification = (req, res) => {
  const { wallet_address, signature } = req.body;
  if (!wallet_address || !signature) {
    response.res400(res, "Wallet Addres and Signature are required");
  } else {
    users
      .findOne({ where: { wallet_address } })
      .then((userResult) => {
        if (!userResult) {
          return response.res404(res, "User Not Found");
        }
        return userResult;
      })
      .then((user) => {
        const msg = `I am signing my one-time nonce: ${user.nonce}`;

        // We now are in possession of msg, wallet_address and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
        const address = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
        });

        console.log("address", address);

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial wallet_address
        if (address.toLowerCase() === wallet_address.toLowerCase()) {
          return user;
        } else {
          return response.res401(res, "Signature verification failed");
        }
      })
      .then((user) => {
        console.log("user", user);
        user.nonce = Math.floor(Math.random() * 10000);
        return user.save();
      })
      .then((user) => {
        return new Promise((resolve, reject) =>
          jwt.sign(
            {
              payload: {
                id: user.id,
                wallet_address,
              },
            },
            config.secret,
            {
              algorithm: config.algorithms[0],
            },
            (err, token) => {
              if (err) {
                return reject(err);
              }
              if (!token) {
                return new Error("Empty token");
              }
              return resolve(token);
            }
          )
        );
      })
      .then((token) => {
        response.res200(res, token);
      })
      .catch((error) => {
        console.log("error verify", error);
        response.res500(res);
      });
  }
};

exports.getUser = async (wallet_address) => {
  try {
    const user = users.findOne({ where: { wallet_address } });
    return user;
  } catch (error) {
    return null;
  }
};

exports.checkOwner = async (req, res) => {
  const { wallet_address, contract_address, token_id } = req.body;
  if (!wallet_address || !token_id) {
    return response.res400(res, "Wallet address and token id are required!");
  }
  try {
    const owner = await getOwnerOf(token_id, contract_address);
    if (owner.toLowerCase() !== wallet_address.toLowerCase()) {
      return response.res403(res, `Sorry, you don't own this NFT`);
    }
    return response.res200(res, { isOwner: true });
  } catch (error) {
    return response.res500(
      res,
      error.message ||
        "Internal system failure. Please contact system administrator"
    );
  }
};
