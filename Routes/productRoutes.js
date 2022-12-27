const express = require("express");
const { getAllProduct,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../Controllers/productController");
const { isAuthenticate, AuthorizeRoles } = require("../middleware/Auth");
const router = express.Router();


router.route("/products").get(getAllProduct)
router.route("/admin/product/new").post(isAuthenticate,AuthorizeRoles("ShopOwner","Admin"),createProduct);

// YE PUT AND POST DONO ME WORK KR RHA HAI SO WHY TO USE PUT
router.route("/admin/product/:id").put(isAuthenticate,AuthorizeRoles("ShopOwner","Admin"),updateProduct).delete(isAuthenticate,AuthorizeRoles("ShopOwner","Admin"),deleteProduct).get(getProductDetails)

router.route("/product/:id").get(getProductDetails);

module.exports = router;