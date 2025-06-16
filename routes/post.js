const express = require("express");
const router = express.Router();
const Controller = require("../controller/post");
const { upload, setDestination } = require("../middleware/image");
const validate = require("../middleware/validation");
const { isAuth } = require("../middleware/jwt");
const { refreshToken } = require("../middleware/refresh");

router.get("/create" , Controller.getCreatePost)
router.get(
  "/",
  Controller.getAllPost
);
router.post(
  "/",
  setDestination("./public/images/posts/"),
  upload.single("image"),
  validate,
  Controller.createPost
);
// router.put(
//   "/:slug",
//   setDestination("./public/images/posts/"),
//   upload.single("image"),
//   validate,
//   Controller.updatePost
// );
router.delete('/:slug' , Controller.deletePost)
router.get('/:slug' ,refreshToken , isAuth, Controller.singlePost)
router.post("/comment/:slug", refreshToken , isAuth, Controller.comment);
router.delete("/comment/:slug",  Controller.deleteComment);
router.post("/likes", Controller.likePost);

module.exports = router;
