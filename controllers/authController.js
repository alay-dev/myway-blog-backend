const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN + 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  //Remove the password from the output
  user.password = undefined;
  user.confirm_password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      token,
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide a email and a password", 400));
  }
  //2) cheack if the user exists && password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  //3)if everything is ok send the token

  createSendToken(user, 200, res, "Login sucessful");
});

exports.singup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    contact_no: req.body.contact_no,
    password: req.body.password,
    url: req.body.url,
    id: req.body.id,
  });

  createSendToken(newUser, 201, res, "Signup sucessful");
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Get Token and ch3eck if it exists
  var token = req.headers.token;
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  //2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user no longer exist", 401));
  }

  //GRNT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get user from the collection

  const user = await User.findById(req.user.id).select("+password");
  //2) check the posted password is correct
  if (!(await user.correctPassword(req.body.current_password, user.password))) {
    return next(
      new AppError("There is no user or the current password is incorrect", 401)
    );
  }
  //3)if the password is correct Update the password
  user.password = req.body.password;
  await user.save();
  //4) log the user in send jwt
  createSendToken(user, 200, res, "Password update sucessful");
});

exports.checkAdmin = catchAsync(async (req, res, next) => {
  if (req.user.type !== "A") {
    return next(new AppError("You do not have permission.", 403));
  }
  req.body.type = "A";
  next();
});

exports.addAdmin = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    contact_no: req.body.contact_no,
    password: req.body.password,
    url: req.body.url,
    id: req.body.id,
    type: req.body.type,
  });

  createSendToken(newUser, 201, res, "Signup sucessful");
});
