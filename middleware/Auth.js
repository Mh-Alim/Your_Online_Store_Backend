const jwt = require("jsonwebtoken");
const Shop = require("../models/shopModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticate = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Login to access this resource",401));
    }

    const decodedData = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decodedData) return next(new ErrorHandler("incorrect token",400));
    req.user = await User.findById(decodedData.id);
    next();
});

exports.AuthorizeRoles = (...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`You are not allowed to access this resource`,403));
        }

        next();
    }
}


exports.isAuthenticateShop = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Login to access this resource",401));
    }

    const decodedData = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decodedData) return next(new ErrorHandler("incorrect token",400));


    let shopExist = await Shop.findById(decodedData.id);
    if(!shopExist) return next(new ErrorHandler("You are not authorized to access this resource",403));
    req.shop = shopExist;
    next();
});