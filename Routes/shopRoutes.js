// const express = require("express");
// const { registerShop, loginShop, forgotShopPassword, resetShopPassword, updateShopPassword, updateShopProfile } = require("../Controllers/shopController");
// const { isAuthenticate, AuthorizeRoles, isAuthenticateShop } = require("../middleware/Auth");
// const router = express.Router();


// router.route('/shop/register').post(isAuthenticate,AuthorizeRoles("Admin"),registerShop);
// router.route('/shop/login').post(loginShop);


// router.route("/password/shop/forgot").post(forgotShopPassword);
// router.route("/password/shop/reset/:token").put(resetShopPassword);

// router.route("/password/shop/update").put(isAuthenticateShop,updateShopPassword);

// router.route("/myshop/update").put(isAuthenticateShop,updateShopProfile);

// module.exports = router;