const mongoose = require("mongoose");
const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const routes = require("./routes/index");
const utils = require("./utils");
require("./auth/passport");

const connectionString =
  "mongodb+srv://dummy:ngSckQNcQlcKYrvB@cluster0-koonn.mongodb.net/very-cool-db?retryWrites=true&w=majority";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({ secret: "very_secret", resave: false, saveUninitialized: false })
);
app.use(flash());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = utils;
  next();
});

mongoose.set("useCreateIndex", true);
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");

    app.use("/", routes);

    // catch 404 are not the result of an error, so must be handled explicitly
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  })
  .catch((error) => {
    console.error.bind(console, "Connection Error:");
  });

module.exports = app;
