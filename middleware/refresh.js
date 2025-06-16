  
  const jwt = require('jsonwebtoken');
  const { sign, verify } = require("jsonwebtoken");
  const { createAccessToken , createRefreshToken} = require("../middleware/jwt")
  
  const User = require("../models/User");
  
  // refresh auth
  module.exports.refreshToken = async (req, res , next) => {
    const { jwt } = req.cookies;
    let secret;
    secret = process.env.TOKEN_SECRET;
  
    try {
      const payload = verify(jwt, secret);
      const user = await User.findOne({ _id: payload.userId })
      if (!user) {
        response.message = "user not found";
        return res.redirect("/")
      }
      refreshToken = createRefreshToken(user);
      console.log(refreshToken)
      res.cookie("jwt", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        // signed: true,
        secure: process.env.NODE_ENV === "prod" ? true : false,
      });
      const accessToken = createAccessToken(user);
      req.body.accessToken = accessToken
      return next();
    } catch (err) {
      console.log(err , "error")
      return res.redirect("/")
    }
  };