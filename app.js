const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const sequelize = require("./Functions/Database/database");
const UsersRoutes = require("./Routes/users");
const SchoolSubjectsRoutes = require("./Routes/schoolSubjects");
const AdministrationRoutes = require("./Routes/administration");

const app = express();

const swaggerDocs = require("./swagger.json");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(cors());
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
app.use("/quiz/schoolSubjects", SchoolSubjectsRoutes);
app.use("/quiz/administration", AdministrationRoutes);

app.listen(port);

module.exports = app;
