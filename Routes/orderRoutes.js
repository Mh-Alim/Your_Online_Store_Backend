const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../Controllers/orderController");
const { isAuthenticate, AuthorizeRoles } = require("../middleware/Auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticate,newOrder);
router.route("/order/:id").get(isAuthenticate,getSingleOrder)
router.route("/orders/me").get(isAuthenticate,myOrders);

// ADMIN ROUTES

router.route("/admin/orders").get(isAuthenticate,AuthorizeRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticate,AuthorizeRoles("admin"),updateOrder).delete(isAuthenticate,AuthorizeRoles("admin"),deleteOrder)

module.exports = router;
