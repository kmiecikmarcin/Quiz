const Sequelize = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(
  process.env.S3_DATABASE_NAME,
  process.env.S3_DATABASE_USER,
  process.env.S3_DATABASE_PASSWORD,
  {
    host: process.env.S3_DATABASE_HOST,
    dialect: "postgres",
  }
);
