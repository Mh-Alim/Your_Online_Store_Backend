const express = require("express");
const { getAllProduct,createProduct, updateProduct, deleteProduct, getProductDetails , createProductReview, getAllReviews,deleteReview, getAdminProducts} = require("../Controllers/productController");
const { isAuthenticate, AuthorizeRoles } = require("../middleware/Auth");
const router = express.Router();


router.route("/products").get(getAllProduct)
router.route("/admin/products").get(isAuthenticate,AuthorizeRoles("admin"),getAdminProducts)
router.route("/admin/product/new").post(isAuthenticate,AuthorizeRoles("admin"),createProduct);

router.route("/admin/product/:id").put(isAuthenticate,AuthorizeRoles("admin"),updateProduct).delete(isAuthenticate,AuthorizeRoles("admin"),deleteProduct)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticate,createProductReview );

router.route("/reviews").get(getAllReviews).delete(isAuthenticate,AuthorizeRoles("admin"),deleteReview);



module.exports = router;