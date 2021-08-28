const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("./userModel");
const Post = require("./postModel");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Empty comment"],
    },
    date: {
      type: Date,
      required: [true, "Date is missing"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// CommentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select:
//       "-__v +name -password -confirm_password -contact_no -email _id +url",
//   });
//   next();
// });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
