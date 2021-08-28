const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.singup);
router.post(
  "/add_admin",
  authController.protect,
  authController.checkAdmin,
  authController.addAdmin
);

router.patch(
  "/update_password",
  authController.protect,
  authController.updatePassword
);

router
  .route("/")
  .get(
    authController.protect,
    authController.checkAdmin,
    userController.getAllUser
  )
  .patch(userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

router
  .route("/delete_self")
  .delete(authController.protect, userController.deleteSelf);

router.route("/get_user").post(authController.protect, userController.getUser);

module.exports = router;
