const express = require("express");
const response = require("../../components/response");
const users = require("./users");
const router = express.Router();

const index = function (req, res, next) {
  response.res404(res);
};

router.all("/", index);

router.use("/users", users);

// router.all('*', index);

module.exports = router;
