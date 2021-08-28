const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalHandler = require("./controllers/errorController");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRouter");
const commentRoutes = require("./routes/commentRouter");

const app = express();

var corsOptions = {
  // origin: "http://localhost:3000",
  origin: "https://vigorous-jennings-bd8330.netlify.app/",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalHandler);

module.exports = app;
