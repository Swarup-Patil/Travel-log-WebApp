require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const path = require("path")
const cookieParser = require('cookie-parser')

const initMiddleware = (app) => {
    app.use(express.json({ limit: "2mb" }));
    app.use(express.urlencoded({ extended: false, limit: "2mb" }));
    app.use(express.static(path.join(__dirname, "../public")));
    app.use(express.static('static'))
    app.use(cookieParser())
    app.use(logger("dev"));
    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "ejs");
  };
  
  module.exports = initMiddleware;