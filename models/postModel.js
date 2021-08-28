const mongoose = require("mongoose");
const User = require("./userModel");
const Comment = require("./commentModel");

const PostSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
    },
    url: {
      type: String,
      requires: [true, "Post image is missing"],
    },
    date: {
      type: Date,
      required: [true, "Date is missing"],
    },
    tags: {
      type: [String],
    },
    mainText: {
      type: String,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// PostSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "likes",
//     select: "-__v +name -password -confirm_password -contact_no -email -_id",
//   });
//   next();
// });

// PostSchema.pre('save', async (next) =>{
//     const userPromise  = this.user.map(async(id) => await User.findById(id)) ;
//     this.user = await Promise.all(userPromise) ;
//     next() ;
// });

// PostSchema.pre('save', async(next) =>{
//     const commentPromises = this.comment.map(async(id)=> await Comment.findById(id)) ;
//     this.comment = await Promise.all(commentPromises) ;
//     next() ;
// });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
