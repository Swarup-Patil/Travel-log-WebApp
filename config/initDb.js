const mongoose = require("mongoose");
require("dotenv").config({ path: "env" });

const initDB = () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // setting up DB_URI
  let dbUri;
  if (process.env.NODE_ENV === "dev") dbUri = process.env.DB_DEV_URI;
  if (process.env.NODE_ENV === "test") dbUri = process.env.DB_TEST_URI;
  if (process.env.NODE_ENV === "prod") dbUri = process.env.DB_URI;

  console.log(dbUri)
  // connection to db
  mongoose.connect(dbUri, options);

  const connection = mongoose.connection;
 
  connection.on("connected", () => {
    console.log("Connected to the database successfully");
  });

  connection.on("error", (err) => {
    console.log(err ,  "error");
  });

  connection.on("disconnected", () => {
    console.log("Disconnected");
  });
};

module.exports = initDB;
