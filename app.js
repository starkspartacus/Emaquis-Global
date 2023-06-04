/** @format */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');
const session = require('express-session')({
  secret: 'maisdismoitucherchesquoiputin',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000,
  },
});

const sharedSession = require('express-socket.io-session');

const indexRouters = require('./routes/index');
const { forceSession } = require('./middleware/auth');
// const adminRouters = require("./routes/admin.router");
//const usersRouter = require("./routes/users.router");

const Serveur = class {
  constructor() {
    this.app = express();
    this.sharedSession = sharedSession;
    this.settings();
    this.middleware();
    this.routes();
  }

  getApp() {
    return this.app;
  }

  settings() {
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
  }

  middleware() {
    //MIDDLEWARES

    this.app.use(
      cors({
        origin: ['http://localhost:3000'],
      })
    );
    this.app.use(logger('dev'));
    this.app.use(session);
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    // this.app.use(bodyParser.urlencoded({ extended: false }));
    // this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(forceSession);
    // this.app.use(function (req, res, next) {
    //   res.locals.user = req.session.user;
    //   next();
    // });
  }

  routes() {
    this.app.use('/', indexRouters);
    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    // this.app.use("/admin", adminRouters);
    //this.app.use("/users", usersRouter);

    // catch 404 and forward to error handler
    this.app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    this.app.use(function (err, req, res, next) {
      console.log('👉 👉 👉  ~ file: app.js:78 ~ err', err);
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }

  getSharedSession() {
    return this.sharedSession(session);
  }
};

module.exports = Serveur;
