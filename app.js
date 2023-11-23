require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const morganBody = require("morgan-body");
const httpServer = http.createServer(app);
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const models = require("./models");

//Sync Database
models.sequelize
  .sync()
  .then(function () {
    console.log("connected to database");
  })
  .catch(function (err) {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());
app.set("trust proxy", true);
app.use(helmet());

morganBody(app);

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    return res
      .status(500)
      .send({
        message: "Invalid data structure. Please read documentation carefully.",
      });
  } else {
    next();
  }
});

app.disable("x-powered-by");

app.use(routes);

const port = process.env.PORT || process.env.SERVICE_PORT;

httpServer.listen(port);

console.log(process.env.SERVICE_NAME + " started on port " + port);

module.exports = app;
