const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllPost = catchAsync(async (req, res, next) => {
  const posts = await Post.find().populate({
    path: "author",
    select: "+name -password +url -__v +email -contact_no",
  });

  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const posts = await Post.findById(req.body.id)
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "+name +url -password -email -__v -contact_no",
      },
    })
    .populate({
      path: "likes",
      select: "+name +url -password -email -__v -contact_no",
    })
    .populate({
      path: "author",
      select: "+name -password +url -__v -email -contact_no",
    });
  res.status(200).json({
    status: "success",
    posts,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "heading",
    "date",
    "url",
    "tags",
    "author",
    "mainText"
  );

  const newPost = await Post.create(filteredBody);

  if (!newPost) {
    return next(new AppError("Failed to create Post", 400));
  }

  res.status(200).json({
    status: "success",
    message: "New post created",
    newPost,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log("update ", post);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Post update sucessful",
    post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.body.id);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Post delete sucessful",
  });
});

exports.likePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.body.id);

  post.likes.push(req.body.user_id);
  req.body = { ...req.body, ...post };
  this.updatePost(req, res, next);
});

exports.unLikePost = catchAsync(async (req, res, next) => {
  let post = await Post.findById(req.body.id);

  post.likes = post.likes.filter(
    (row) => row.toString() !== req.body.user_id.toString()
  );
  req.body = { ...req.body, ...post };
  this.updatePost(req, res, next);
});
