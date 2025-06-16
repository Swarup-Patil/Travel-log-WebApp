const mongoose = require("mongoose");
const nanoid = require("nanoid");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const Post = require("../models/Post")

module.exports.getUserProfile = async (req, res) => {
    console.log(req.params)
    const user = await User.findOne({ slug: req.params.slug })
    res.render("profile.ejs" , { user: user});
  };