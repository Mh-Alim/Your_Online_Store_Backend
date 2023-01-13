const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser  } = require("../Controllers/userController");
const {isAuthenticate,AuthorizeRoles} = require("../middleware/Auth");


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticate,getUserDetails);
router.route("/password/update").put(isAuthenticate,updatePassword);
router.route("/me/update").put(isAuthenticate,updateUserProfile);


// This two routes i have to make for shop 
// it will be like shopowner can see all his users
router.route("/admin/users").get(isAuthenticate,AuthorizeRoles("admin"),getAllUsers);
router.route("/admin/user/:id").get(isAuthenticate,AuthorizeRoles("admin"),getSingleUser).put(isAuthenticate,AuthorizeRoles("admin"),updateUserRole).delete(isAuthenticate,AuthorizeRoles("admin"),deleteUser);


module.exports = router;