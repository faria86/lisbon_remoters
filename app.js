"use strict";

const { join } = require("path");
const express = require("express");
const createError = require("http-errors");
const connectMongo = require("connect-mongo");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const logger = require("morgan");
const mongoose = require("mongoose");
const sassMiddleware = require("node-sass-middleware");
const serveFavicon = require("serve-favicon");
const basicAuthenticationDeserializer = require("./middleware/basic-authentication-deserializer.js");
const bindUserToViewLocals = require("./middleware/bind-user-to-view-locals.js");

const indexRouter = require("./routes/index");
const authenticationRouter = require("./routes/authentication");
const placeRouter = require("./routes/place");
const commentRouter = require("./routes/comment");
const gitHubRouter = require("./routes/git-hub-authentication");

const debug = require("debug");
const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");
const hbs = require("hbs");
const hbsJson = require("hbs-json");

//CONNECT PASSPORT
const passport = require("passport");
require("./config-passport");
//END CONNECT

const app = express();

hbs.registerHelper("json", hbsJson);

app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(serveFavicon(join(__dirname, "public/images", "favicon.ico")));
app.use(
  sassMiddleware({
    src: join(__dirname, "public"),
    dest: join(__dirname, "public"),
    outputStyle: process.env.NODE_ENV === "development" ? "nested" : "compressed",
    force: process.env.NODE_ENV === "development",
    sourceMap: true,
  })
);
app.use(express.static(join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 15 * 60 * 60 * 24 * 1000,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    store: new (connectMongo(expressSession))({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
    }),
  })
);

require("./config-passport");

//PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());
//END INT

app.use(basicAuthenticationDeserializer);
app.use(bindUserToViewLocals);

app.use("/", indexRouter);
app.use("/authentication", authenticationRouter);
app.use("/place", placeRouter);
app.use("/comment", commentRouter);
app.use("/git-hub-authentication", gitHubRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};
  res.status(error.status || 500);
  res.render("error");
});

module.exports = app;
