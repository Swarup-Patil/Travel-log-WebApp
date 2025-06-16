// const testRouter = require("./test");
const loginRouter = require("./login");
const PostRouter = require("./post");
const ProfileRouter = require("./profile");

const initRoutes = (app) => {

    app.use("/" , loginRouter);
    app.use("/post" , PostRouter);
    app.use("/profile" , ProfileRouter);
}    

module.exports = initRoutes;