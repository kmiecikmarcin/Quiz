## School quiz backend
Rest API created in Node.js.

### Documentation
Documentation created with Swagger. [Check it out](https://learnandtest.herokuapp.com/api-docs/)

### Prerequisites
* [Node.js](https://nodejs.org/en/) - you must have Node.js installed on your local system. Download the Node.js source code or a pre-built installer for your operating system.

* [PostgreSQL](https://www.postgresql.org) - for database management.

* NPM install - for installation of packages.

### Built With
* [Express](https://expressjs.com) - The web framework used.
* [Sequelize](https://sequelize.org) - Sequelize is a promise-based Node.js ORM for Postgres.
* [Express-validator](https://express-validator.github.io/docs/) - is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.
* [Swagger](https://swagger.io) - is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document and consume REST APIs.
* [Jsonwebtoken](https://jwt.io) - JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - a library to help with hash passwords.
* [Eslint](https://www.npmjs.com/package/eslint) - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* [Nodemon](https://www.npmjs.com/package/nodemon) - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected
* [Husky](https://www.npmjs.com/package/husky) - for pre-commits and pre-push which checks bugs based on Eslint and Postman.
* [Newman](https://www.npmjs.com/package/newman) - newman is a command-line collection runner for Postman.
* [Pg](https://www.npmjs.com/package/pg) - non-blocking PostgreSQL client for Node.js.

### Testing
* [Postman](https://www.postman.com) 
* Unit tests: 
    * [Mocha](https://www.npmjs.com/package/mocha)
    * [Chai](https://www.npmjs.com/package/chai)
    * [Sinon](https://www.npmjs.com/package/sinon)
    * [Sequelize-test-helpers](https://www.npmjs.com/package/sequelize-test-helpers)

### Run with npm
* At first in your folder with project run:
```
npm install
```
It installs package for project. 
* Create .env file
* Update .env:

```
S3_DATABASE_HOST = localhost  
S3_DATABASE_NAME = exampleName  
S3_DATABASE_PASSWORD = examplePassword  
S3_DATABASE_USER = exampleUserName
S3_SECRETKEY = ExAmP1EKeY
S3_USER_PERMISSIONS = Student
S3_TEACHER_PERMISSIONS = Teacher
S3_ADMIN_PERMISSIONS = Administrator
```
* You can run:
```
npm run start
```
Runs the app in the development mode.
