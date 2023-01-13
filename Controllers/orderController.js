const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");


exports.newOrder = catchAsyncErrors(async(req,res,next)=>{


    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id,
    });


    res.status(200).json({
        success : true,
        order
    })
})



// GET SINGLE ORDER 

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")

    if(!order) {
        return next(new ErrorHandler("Order not found with this id",404));
    }

    res.status(200).json({
        success : true,
        order,
    })
});

// ALL ORDERS THAT SINGLE USER MADE

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id});
    
    res.status(200).json({
        success : true,
        orders
    })
})




// GET ALL ORDERS -- ADMIN
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmout = orders.reduce((accum,item)=>{
        return accum + item.totalPrice
    },0);
    res.status(200).json({
        success : true,
        totalAmout,
        orders
    })
});


// UPDATE ORDER STATUS -- ADMIN
async function updateStock (id,quantity){
    
    const product = await Product.findById(id);
    if(!product) return ;
    product.stock -= quantity;
    await product.save({validateBeforeSave : false});

    return {
        success : true,
    }
}

exports.updateOrder = catchAsyncErrors( async (req,res,next) => {
    const order = await Order.findById(req.params.id);
``
    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",404))
    }

    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async(o)=>{
             await updateStock(o.product_id,o.quantity);
     
        });
    
    }



    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave : false})
    res.status(200).json({
        success : true,
    })
})




// DELETE ORDER -- ADMIN

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id ",404));
    }

    await order.remove();
    res.status(200).json({
        success : true,
    })
})