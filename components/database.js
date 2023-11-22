const { Sequelize, DataTypes } = require("sequelize");

// const maindb = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql',
//     logging: false,
//     timezone: '+07:00'
// });

const maindb = new Sequelize("sqlite::memory:");

const users = require("../models/users");

const usersModel = users(maindb, DataTypes);

module.exports = {
  users: usersModel,
};
