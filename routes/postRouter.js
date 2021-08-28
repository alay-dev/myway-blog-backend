const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPost)
  .post(postController.createPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router.route("/get_post").post(postController.getPost);
router.route("/like_post").post(postController.likePost);
router.route("/unlike_post").post(postController.unLikePost);

module.exports = router;
