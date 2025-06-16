const fs = require("fs");
// const sharp = require("sharp");

module.exports = async (req, res, next) => {
  let response = { success: false, message: "" };
  let checkImage = false;

  if (req.file) {
    if (
      !req.file.mimetype.includes("jpeg") &&
      !req.file.mimetype.includes("png") &&
      !req.file.mimetype.includes("jpg")
    ) {
      fs.unlinkSync(req.file.path);
      response.message = "Please provide image with appropriate file type"; // msg
      return res.status(400).json(response);
    }

    // file max size would be 1mb
    // if (req.file.size > 1024 * 1024) {
    //   fs.unlinkSync(req.file.path);
    //   response.message = "Please provide image with size less than 1Mb ";
    //   return res.status(400).json(response);
    // }
  }

  const validate = (file, name) => {
    if (file.length > 10) {
      for (let j = 0; j < file.length; j++) {
        fs.unlinkSync(file[j].path);
      }
      response.message = `Please upload less than 10 ${name} images at a time`; // msg
      checkImage = true;
      return null;
    }
    for (let i = 0; i < file.length; i++) {
      if (
        !file[i].mimetype.includes("jpeg") &&
        !file[i].mimetype.includes("png") &&
        !file[i].mimetype.includes("jpg")
      ) {
        response.message = `Please provide ${name} image with appropriate file type`; // msg
        checkImage = true;
        if (name === "gallery") {
          for (let j = 0; j < file.length; j++) {
            fs.unlinkSync(file[j].path);
          }
        } else fs.unlinkSync(file[i].path);
        return null;
      }

      // file max size would be 1mb
      if (file[i].size > 1024 * 1024) {
        response.message = `Please provide ${name} image with size less than 1Mb`;
        checkImage = true;
        if (name === "gallery") {
          for (let j = 0; j < file.length; j++) {
            fs.unlinkSync(file[j].path);
          }
        } else fs.unlinkSync(file[i].path);
        return null;
      }
    }
  };

  if (req.files) {
    if (req.files.backcover) validate(req.files.backcover, "backcover");
    if (req.files.profile) validate(req.files.profile, "profile");
    if (req.files.gallery) validate(req.files.gallery, "gallery");
  }

  if (checkImage) {
    return res.status(400).json(response);
  }

  // if (req.file) {
  //   console.log(req.file);
  // }
  // if (req.files) {
  //   console.log(req.files);
  // }
  
  //compressing image/images
  // await compressImage(req,next);

  next();
  
};



