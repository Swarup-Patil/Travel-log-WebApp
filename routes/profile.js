const express = require("express");
const router = express.Router();
const profile = require("../controller/profile");

router.get("/:slug", profile.getUserProfile);
// router.get("/", profile.getProfiles);
// router.post("/follow", profile.follow);
// router.post("/unFollow", profile.unFollow);

module.exports = router;