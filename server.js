const express = require("express");
const app = express();
const initDB = require("./config/initDb");
const initMiddlewares = require("./config/initMiddleware");
const initRoutes = require("./routes/index");
const path = require("path");
let PORT = 5000;

// Initializing DB
initDB();

// Initializing Middlewares
initMiddlewares(app);

// Initializing Routes
initRoutes(app);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'static/index.html'))
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

