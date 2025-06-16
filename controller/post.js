const Post = require("../models/Post");
const mongoose = require("mongoose");
const nanoid = require("nanoid");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const constant = require("../constant");

module.exports.getCreatePost = (req, res) => {
  return res.render("create.ejs");
};

module.exports.createPost = async (req, res) => {
  //* destructuring
  const { name, body, startDate, endDate, country, state, city, ar } = req.body;
  console.log(req.body);
  console.log(req.file, "image");
  let _id = mongoose.Types.ObjectId(); //Todo: req user
  let randomString = nanoid(5);
  let response = { success: false, message: "" };

  //* validation
  if (!name) {
    response.message = "Please provide a title to the event";
    fs.unlinkSync(req.file.path);
    return res.status(400).json(response);
  } else if (!body && body.length < 70) {
    fs.unlinkSync(req.file.path);
    response.message =
      "Please provide a description to the event and add some more lines";
    return res.status(400).json(response);
  } else if (!startDate) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a start date to the event";
    return res.status(400).json(response);
  } else if (endDate < startDate) {
    fs.unlinkSync(req.file.path);
    response.message = "Please enter correct end date";
    return res.status(400).json(response);
  } else if (!req.file) {
    response.message = "Please upload the image";
    return res.status(400).json(response);
  } else if (!country) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a country you explored";
    return res.status(400).json(response);
  } else if (!state) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a state you explored";
    return res.status(400).json(response);
  } else if (!city) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a city you explored";
    return res.status(400).json(response);
  }

  let entries = Object.entries(constant.Qr);
  let scanme;
  let data = entries.map(([key, val] = entry) => {
    if (key == ar) {
      scanme = val;
    }
    return scanme;
  });

 
  //* image path
  let image;
  if (req.file.originalname != "") {
    if (process.env.NODE_ENV == "prod")
      image = process.env.APP_URL + "/images/posts/" + req.file.filename;
    if (process.env.NODE_ENV == "test")
      image = process.env.APP_TEST_URL + "/images/posts/" + req.file.filename;
    if (process.env.NODE_ENV == "dev")
      image = process.env.APP_DEV_URL + "/images/posts/" + req.file.filename;
  }

  //* create post
  let post = new Post({
    name,
    body,
    image,
    ar: scanme,
    Dates: { startDate: startDate, endDate: endDate },
    createdBy: _id,
    coverImage: image,
    Location: { country: country, state: state, city: city },
    slug: randomString + "-" + slugify(name, { lower: true }),
  });


  //* Saving Post
  await post
    .save()
    .then((result) => {
      let response = { success: false, message: "" };
      if (result) {
        response.success = true;
        response.message = "Post Created Successful";
        // Todo: Render screen
        // return res.status(201).json(response);
        return res.redirect("/dashboard");
      }
    })
    .catch((err) => {
      fs.unlinkSync(req.file.path);
      console.log(err, "error");
      response.errMessage = err.message;
      response.message = "Failed to create event , please try again";
      return res.status(400).json(response);
    });
};

module.exports.updatePost = async (req, res) => {
  //* destructuring
  const { name, body, startDate, endDate, country, state, city } = req.body;
  let _id = mongoose.Types.ObjectId();
  let randomString = nanoid(5);
  let newSlug;

  //* validation
  if (!name) {
    response.message = "Please provide a name to the event";
    fs.unlinkSync(req.file.path);
    return res.status(400).json(response);
  } else if (!body && body.length < 70) {
    fs.unlinkSync(req.file.path);
    response.message =
      "Please provide a description to the event and add some more lines";
    return res.status(400).json(response);
  } else if (!startDate) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a start date to the event";
    return res.status(400).json(response);
  } else if (endDate < startDate) {
    fs.unlinkSync(req.file.path);
    response.message = "Please enter correct end date";
    return res.status(400).json(response);
  } else if (!req.file) {
    response.message = "Please upload the image";
    return res.status(400).json(response);
  } else if (!country) {
    // Todo: enum country list phekneka with short list.
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a country you explored";
    return res.status(400).json(response);
  } else if (!state) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a state you explored";
    return res.status(400).json(response);
  } else if (!city) {
    fs.unlinkSync(req.file.path);
    response.message = "Please provide a city you explored";
    return res.status(400).json(response);
  }

  //* image path
  let image;
  if (req.file.originalname != "") {
    if (process.env.NODE_ENV == "prod")
      image = process.env.APP_URL + "/images/events/" + req.file.filename;
    if (process.env.NODE_ENV == "test")
      image = process.env.APP_TEST_URL + "/images/events/" + req.file.filename;
    if (process.env.NODE_ENV == "dev")
      image = process.env.APP_DEV_URL + "/images/events/" + req.file.filename;
  }

  //* slug
  await Post.findOne({ slug })
    .then((data) => {
      if (data.name != name) {
        newSlug = randomString + "-" + slugify(name, { lower: true });
      } else {
        newSlug = slug;
      }
    })
    .catch((err) => {
      response.errMessage = err.message;
      response.message = "Failed to update event , please try again";
      return res.status(400).json(response);
    });

  //* create post
  let post = new Post({
    name,
    body,
    image,
    eventDates: { startDate: startDate, endDate: endDate },
    createdBy: _id,
    location: { country: country, state: state, city: city },
    slug: newSlug,
  });

  //* Update Post
  await Post.findOneAndUpdate({ slug, createdBy: userId }, post, {
    new: true,
  })
    .then(() => {
      if (image != oldImage) {
        let imageName = oldImage.split("/");
        let imagepath =
          path.join(__dirname, "../public/images/events/") +
          imageName[imageName.length - 1];
        fs.unlink(imagepath, (err) => {
          if (err) {
            response.errMessage = err.message;
            response.message = "Failed to update event , please try again";
            return res.status(400).json(response);
          }
        });
      }
      response.success = true;
      response.message = "Event updated Successfully";
      return res.status(201).json(response);
    })
    .catch((err) => {
      response.errMessage = err.message;
      response.message = "Failed to update event , please try again";
      return res.status(400).json(response);
    });
};

module.exports.getAllPost = async (req, res) => {
  let response = {
    success: false,
    data: { recent: "", totalPage: "" },
  };
  // const today = new Date();
  // const page = 1;
  // const limit = 12;
  // const startIndex = (page - 1) * limit;

  // let promises = [];

  //recent event
  // promises.push(
  let data = await Post.find().sort({ "Dates.startDate": -1 }).limit(6);
  // );

  //total page
  // promises.push(
  //   Post.countDocuments({
  //     "Dates.startDate": { $lt: today.toDateString() },
  //   })
  // );

  try {
    if (data) {
      response.success = true;
      //Todo: render
      return res.render("explore", { post: data });
      // return res.status(200).json(response);
    } else {
      response.Message = "Could get the Post for you , please try again";
      return res.status(400).json(response);
    }
  } catch (err) {
    console.log(err);
    response.errMessage = err.message;
    return res.status(400).json(response);
  }
};

module.exports.deletePost = async (req, res) => {
  const { slug } = req.params;
  let imageName;
  let response = { success: false, message: "" };
  try {
    const result = await Post.findOneAndDelete({ slug }); //Todo: created by user id
    imageName = result.image.split("/");
    let imagepath =
      path.join(__dirname, "../public/images/posts/") +
      imageName[imageName.length - 1];
    fs.unlinkSync(imagepath);
    response.success = true;
    response.message = "Post deleted successfully";
    return res.status(200).json(response);
  } catch (error) {
    response.message = "Post not deleted , please try again";
    response.errMessage = error.message;
    return res.status(400).json(response);
  }
};

module.exports.singlePost = async (req, res) => {
  let response = { success: false };
  let blog;
  let like = "false";
  try {
    const { slug } = req.params;
    let post = await Post.findOne({ slug: slug }).populate({
      path: "comments.author",
      select: "profile name",
    });
    if (post) {
      console.log(post, "post");
      response.success = true;
      blog = post;
      if (post.likes.includes(req.user.userId)) like = "true";
      console.log(blog.like, "hello");
      //Todo: render
      // return res.status(200).json(response);
      return res.render("singleBlog", { post: blog, like: like });
    } else {
      response.message = "Could not get the post , please try again";
      res.render("singleBlog", { post: blog, like: like });
    }
  } catch (error) {
    // console.log(error, "error");
    response.message = error.message;
    return res.status(400).json(response);
  }
};

module.exports.comment = async (req, res) => {
  const userId = req.user.userId; //Todo: req user
  const { slug } = req.params;
  let response = { success: false, message: "", errMessage: "" };

  const comment = {
    message: req.body.message,
    author: userId,
  };
  await Post.findOneAndUpdate(
    { slug: slug },
    { $push: { comments: comment } },
    { new: true }
  )
    .then((result) => {
      if (result) {
        response.success = true;
        response.message = "Commented successfully";
        //Todo: render page or return
        return res.redirect(`/post/${slug}`);
      }
    })
    .catch((err) => {
      response.message = "comment could not get posted , please try again";
      response.errMessage = err.message;
      console.log(err.message, "error");
      return res.status(400).json(response);
    });
};

module.exports.deleteComment = async (req, res) => {
  let response = {
    success: false,
    message: "",
  };
  const { slug } = req.params;
  const id = req.body.id;

  await Post.findOneAndUpdate(
    { slug: slug },
    { $pull: { comments: { _id: id } } }
  )
    .then((result) => {
      response.success = true;
      response.message = "Comment deleted successfully";
      return res.status(200).json(response);
    })
    .catch((error) => {
      response.message = "Please try again , failed to delete comment";
      // console.log(error, "error");
      //Todo: render page or return
      response.errMessage = error.message;
      return res.status(400).json(response);
    });
};

module.exports.likePost = async (req, res) => {
  let slug = req.body.slug;
  const userId = "63297106e19a113edaa6bf7a";
  const isLike = req.body.isLike;
  let response = { success: false, message: "" };
  console.log(isLike, "yoo");
  if (!isLike) {
    console.log(slug, userId, "andar aya");
    await Post.findOneAndUpdate(
      { slug: slug },
      { $addToSet: { likes: userId } }
    )
      .then(async (result) => {
        if (result) {
          result.likesCount++;
          await result.save();
          response.success = true;
          response.message = "Post liked";
          console.log(result);
          return res.status(200).json(response);
        }
      })
      .catch((err) => {
        response.message = "please try again";
        response.errMessage = err.message;
        console.log(err.message);
        return res.status(400).json(response);
      });
  } else {
    await Post.findOneAndUpdate({ slug: slug }, { $pull: { likes: userId } })
      .then(async (result) => {
        if (result) {
          result.likesCount--;
          await result.save();
          response.success = true;
          response.message = "Blog unliked";
          console.log(result);
          return res.status(200).json(response);
        }
      })
      .catch((err) => {
        response.message = "Personal Error Message";
        response.errMessage = err.message;
        console.log(err.message);
        return res.status(400).json(response);
      });
  }
  console.log("the end ");
};
