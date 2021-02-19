const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./Functions/Database/database");
const UsersRoutes = require("./Routes/users");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database created!");
  })
  .catch((error) => {
    throw new Error(error);
  });

const port = process.env.PORT || 3000;

app.use("/quiz/users", UsersRoutes);

app.listen(port);

module.exports = app;
