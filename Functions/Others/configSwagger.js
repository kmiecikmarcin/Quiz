const swaggerOptions = {
  openapi: "3.0.3",
  swaggerDefinition: {
    info: {
      title: "Learn and test knowledge - API",
      description: "API for easy study new things from school",
      version: "0.1.2",
    },
    host: "localhost:3000",
    basePath: "/quiz/",
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./Routes/*.js"],
};

module.exports = swaggerOptions;
