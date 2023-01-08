const express = require("express");
const { processPayment, sendStripePublishableKey } = require("../Controllers/paymentControllers");
const router =express.Router();

const {isAuthenticate} = require("../middleware/Auth")


router.route("/payment/process").post(isAuthenticate,processPayment);
router.route("/stripeApiKey").get(isAuthenticate,sendStripePublishableKey);
module.exports = router;