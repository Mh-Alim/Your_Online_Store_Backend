const catchAsyncErrors = require("../middleware/catchAsyncErrors");
require('dotenv').config({ path: './.env' })
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



exports.processPayment = catchAsyncErrors(async(req,res,next)=>{
    console.log(req.body)

    console.log("here in payment")
    const myPayment = await stripe.paymentIntents.create({
        amount : req.body.amount,
        currency : "inr",
        metadata : {
            company : "YSTORE"
        }
    });
console.log("after payment");
    res.status(200).json({

        success : true,
        client_secret : myPayment.client_secret
    })
})

exports.sendStripePublishableKey = catchAsyncErrors(async(req,res,next)=>{
   
    res.status(200).json({
        stripePublishableKey : process.env.STRIPE_PUBLISHABLE_KEY
    })
})
