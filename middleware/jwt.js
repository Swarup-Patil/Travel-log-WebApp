const jwt = require('jsonwebtoken');
const { sign, verify } = require("jsonwebtoken");

const User = require("../models/User");

module.exports.createAccessToken = (User) => {
    let secret;
    secret = process.env.TOKEN_SECRET;

    const token = sign({ userId: User.id }, secret, {
      expiresIn: "15m",
    });
    return token;
  };
  
  module.exports.createRefreshToken = (User) => {
    let secret;
    secret = process.env.TOKEN_SECRET;
  
    const token = sign({ userId: User._id }, secret, {
      expiresIn: "15d",
    });
    return token;
  };
  
  module.exports.isAuth = (req, res, next) => {
    // const authorization = req.header("Authorization");
    const authorization = req.body.accessToken
    let user = {};
    let response = { success: false, message: "" };
    let secret;
    secret = process.env.TOKEN_SECRET;
    if (!authorization) {
      response.message = "Not authorized";
      return res.status(401).send(response);
    }
    try {
      verify(authorization, secret, function (err, decoded) {
        if (err) throw err;
        user = decoded;
      });
      req.user = user;
      return next();
    } catch (err) {
      console.log(err);
      response.message = "Not authenticated";
      return res.redirect("/");
    }
  }; 

