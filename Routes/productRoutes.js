const express = require("express");
const { getAllProduct,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../Controllers/productController");
const { isAuthenticate, AuthorizeRoles, isAuthenticateShop } = require("../middleware/Auth");
const router = express.Router();


router.route("/products").get(getAllProduct)
router.route("/shop/product/new").post(isAuthenticateShop,createProduct);

// YE PUT AND POST DONO ME WORK KR RHA HAI SO WHY TO USE PUT
router.route("/shop/product/:id").put(isAuthenticateShop,updateProduct).delete(isAuthenticateShop,deleteProduct).get(getProductDetails)

router.route("/product/:id").get(getProductDetails);

module.exports = router;