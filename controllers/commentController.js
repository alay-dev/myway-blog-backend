const Comment = require("../models/commentModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const postController = require("../controllers/postController");
const Post = require("../models/postModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllComment = catchAsync(async (req, res, next) => {
  const comments = await Comment.find().populate("user");

  res.status(200).json({
    status: "success",
    comments,
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "comment", "date", "user");

  const newComment = await Comment.create(filteredBody);

  if (!newComment) {
    return next(new AppError("Failed to added comment", 400));
  }
  console.log("newComment", newComment);
  let post = await Post.findById(req.body.id);
  post.comments.push(newComment._id);
  req.body = post;
  console.log(req.body, post);
  postController.updatePost(req, res, next);

  res.status(200).json({
    status: "success",
    newComment,
  });
});

// exports.updateComment = catchAsync(async(req, res, next) => {
//     const comment = await Comment.findByIdAndUpdate(req.body.id, req.body,{
//         new: true,
//         runValidators: true
//     }) ;

//     if(!comment) {
//         res.status(404).json({
//             status: 'failed',
//             message: 'Comment does not exist'
//         })

//         return next() ;
//     }

//     res.status(200).json({
//         status:'success',
//         comment
//     })
// });

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.body.id);

  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Comment delete successful",
  });
});
