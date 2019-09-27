require('dotenv').config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const app = express();

const swaggerUi = require('swagger-ui-express'),
  swaggerJSDoc = require('swagger-jsdoc');

function getApp() {
  return new Promise(async (resolve, reject) => {
    // view engine setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "jade");

    app.use(cors());
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, '../client/build')));

    const swaggerSpec = swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: 'ART API',
          version: '1.0.0',
          description: 'Anti-social Redneck Telephone-operators',
        },
      },
      apis: ['/home/site/wwwroot/api/routes/*']
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Load routes into API here
    await indexRouter.configure(app);

    // Handles any requests that don't match the ones above
    app.get('*', (req,res) =>{
      res.sendFile('/home/site/wwwroot/client/build/index.html');
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });


    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
      console.error(err.stack);
      res.status(500).send(`Error encountered: ${err} \n ${err.stack}`)
    });

    resolve(app);
  });
}

module.exports = { getApp };
