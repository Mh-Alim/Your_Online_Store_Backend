const Shop = require("../models/shopModel");
const {sendToken} = require("../utils/sendToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorHandler")
const crypto = require("crypto")
const {sendEmail} = require("../utils/sendEmail");


// REGISTER A SHOP

exports.registerShop = catchAsyncErrors( async(req,res,next)=>{

    const { name , email, password, pinCode,city,address } = req.body;
    if(!name || !email || !password || !pinCode || !city || !address){
        return next(new ErrorHandler("Fill the empty Fields",400));
    }

    const shop = await Shop.create({
        name,email,password,
        shopDp: {
            public_id : "sample shop public id",
            url : "sample shop url"
        },

        location : {
            pinCode,
            city,
            address
        }

    });
    res.status(200).json({
        success : true,
        message : "shop is created ",
        shop
    })
});




// Login User
exports.loginShop = catchAsyncErrors( async(req,res,next)=>{
    const {email,password} = req.body;

    // checking if the user has name and password both 

    if(!email || !password){
        return next(new ErrorHandler("Fill the empty Fields",400));
    }

    const shop  = await Shop.findOne({email}).select("+password");

    if(!shop){
        return next(new ErrorHandler("Enter valid email or password",400));
    }

    const isPasswordMatched = await shop.passwordMatched(password);
    if(!isPasswordMatched) return next(new ErrorHandler("Enter valid email or password",400));

    sendToken(shop,200,res);
    
})


// LOGOUT WILL REMAIN SAME AS USER


exports.forgotShopPassword = catchAsyncErrors(async(req,res,next)=>{
    const {email} = req.body;
    if(!email) return next(new ErrorHandler("Fill Empty fields",400));
    const shop = await Shop.findOne({email});
    if(!shop) return next(new ErrorHandler("You haven't registered yet",404));

    // Get resetPassword token

    const resetToken = await shop.getResetPasswordToken();

    await shop.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/shop/reset/${resetToken}`;

    const message = `Your reset password link is \n\n ${resetPasswordUrl} \n`

    try{
        await sendEmail({
            email : shop.email,
            subject : "Local Online Store Reset Password",
            message
        });

        res.status(200).json({
            success : true,
            message : `Email sent to ${shop.email}`
        })
    }
    catch(err){
        shop.resetPasswordExpire = undefined;
        shop.resetPasswordToken = undefined;    
        shop.save({validateBeforeSave: false});
        return next(new ErrorHandler(err.message,500));
    }

});


exports.resetShopPassword = catchAsyncErrors(async(req,res,next)=>{
    const token = req.params.token;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest("hex");
    console.log(token);
    console.log(resetPasswordToken)
    const shop = await Shop.findOne({
        resetPasswordToken,
        resetPasswordExpire : {
            $gt : Date.now(),
        }
    });
    if(!shop) return next(new ErrorHandler(" Reset Password token is invalid or has been expired ",400));


    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Password is not matched",400));
    }

    shop.password = req.body.password;
    shop.resetPasswordExpire = undefined;
    shop.resetPasswordToken = undefined;

    await shop.save();
    sendToken(shop,200,res);

});



// UPDATE SHOP PASSWORD 


// CHANGE PASSWORD

exports.updateShopPassword = async(req,res,next)=>{
    const shop = req.shop;
    const {oldPass,newPass,confirmPass} = req.body;

    const isPasswordMatched = await shop.passwordMatched(oldPass);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",404));
    }
    
    if(newPass !== confirmPass){
        return next(new ErrorHandler("New Password is not matched",400));
    }

    shop.password = newPass;
    await shop.save();
    sendToken(shop,200,res);
}


// UPDATE SHOP PROFILE 


exports.updateShopProfile = catchAsyncErrors(async(req,res,next)=>{
    const newShopData = {
        name : req.body.name,
        email : req.body.email,
    }

    // add cloudanry later,

    const shop = await Shop.findByIdAndUpdate(req.shop._id,newShopData``,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    });

    res.status(200).json({
        success : true,
        shop
    })
});
