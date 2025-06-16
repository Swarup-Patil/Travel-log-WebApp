const express = require("express");
const router = express.Router();
const Controller = require("../controller/login");
const { isAuth } = require("../middleware/jwt");
const { refreshToken } = require("../middleware/refresh");

router.get("/", Controller.signIn);
router.get("/dashboard", refreshToken , isAuth , Controller.home);
router.get("/register", Controller.register);
router.post("/register", Controller.registration);
router.post("/login/auth/google", Controller.authGoogle);

module.exports = router;
