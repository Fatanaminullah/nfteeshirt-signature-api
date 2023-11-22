const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/users");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/").get((req, res) => {
  usersController.signIn(req, res);
});

router.route("/").post((req, res) => {
  usersController.signUp(req, res);
});

router.route("/verify").post((req, res) => {
  usersController.signatureVerification(req, res);
});

router.route("/owner").post((req, res) => {
  usersController.checkOwner(req, res);
});

router.all("*", index);

module.exports = router;
