## School quiz backend
Rest API created in Node.js.

### Documentation
API documentation created using [Swagger](https://learnandtest.herokuapp.com/api-docs/)

### Prerequisites
* [Node.js](https://nodejs.org/en/) - you must have Node.js installed on your local system. Download the Node.js source code or a pre-built installer for your operating system.

* [PostgreSQL](https://www.postgresql.org) - for database management.

* [Docker](https://www.docker.com/) - to run project.

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

### Run with docker
* At first in your folder with project run:
```
docker-compose build
```
Create the file for environment variables: 
* Create .env file
* Update .env:

```
S3_DATABASE_HOST = localhost  
S3_DATABASE_NAME = exampleName  
S3_DATABASE_PASSWORD = examplePassword  
S3_DATABASE_USER = exampleUserName
S3_SECRETKEY = ExAmP1EKeY
S3_USER_PERMISSIONS = Uczeń
S3_TEACHER_PERMISSIONS = Nauczyciel
S3_ADMIN_PERMISSIONS = Administrator
```
* If you want to run the API you should use the command like:
```
docker-compose up 
```

### Run with npm
* At first in your folder with project run:
```
npm install
```
Create the file for environment variables: 
* Create .env file
* Update .env:

```
S3_DATABASE_HOST = localhost  
S3_DATABASE_NAME = exampleName  
S3_DATABASE_PASSWORD = examplePassword  
S3_DATABASE_USER = exampleUserName
S3_SECRETKEY = ExAmP1EKeY
S3_USER_PERMISSIONS = Uczeń
S3_TEACHER_PERMISSIONS = Nauczyciel
S3_ADMIN_PERMISSIONS = Administrator
```
* If you want to run the API you should use the command like:
```
npm run start
```
Runs the app in the development mode.
