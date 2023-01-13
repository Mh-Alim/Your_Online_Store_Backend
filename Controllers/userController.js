const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/sendToken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");






// Register a user

exports.registerUser = catchAsyncErrors( async(req,res,next)=>{

    const { name , email, password,cpassword} = req.body;
    console.log(name,email,password,cpassword);
    if(!name || !email || !password || !cpassword){
        return next(new ErrorHandler("Fill the empty Fields",400));
    }

    if(password !== cpassword) return next(new ErrorHandler("Password not matched",400));
    
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width:150,
        crop : "scale"
    })
    const user = await User.create({
        name,email,password,
        avatar: {
            public_id : myCloud.public_id,
            url : myCloud.secure_url
        }
    });
    sendToken(user,201,res);
});


// Login User
exports.loginUser = catchAsyncErrors( async(req,res,next)=>{
    const {email,password} = req.body;
    console.log("login ",email,password);

    // checking if the user has name and password both 

    if(!email || !password){
        return next(new ErrorHandler("Fill the empty Fields",400));
    }

    const user  = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Enter valid email or password",400));
    }

    const isPasswordMatched = await user.passwordMatched(password);
    if(!isPasswordMatched) return next(new ErrorHandler("Enter valid email or password",400));

    sendToken(user,200,res);
    
})



exports.logout = catchAsyncErrors( async(req,res,next)=>{
    res.cookie("token",null,{expires: new Date(Date.now())});
    res.status(200).json({
        success : true,
        message : "Successfully logged out"
    })
})


exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const {email} = req.body;
    console.log(email);
    if(!email) return next(new ErrorHandler("Fill Empty fields",400));
    const user = await User.findOne({email});
    console.log(user)
    if(!user) return next(new ErrorHandler("You haven't registered yet",404));
    console.log("coming");
    // Get resetPassword token

    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // const protocol = ${req.protocol}://${req.get("host")}
    const resetPasswordUrl = `${process.env.FRONTEND_LINK}/password/reset/${resetToken}`;

    const message = `Your reset password link is \n\n ${resetPasswordUrl} \n`

    try{
        await sendEmail({
            email : user.email,
            subject : "Local Online Store Reset Password",
            message
        });

        res.status(200).json({
            success : true,
            message : `Email sent to ${user.email}`
        })
    }
    catch(err){
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;    
        user.save({validateBeforeSave: false});
        return next(new ErrorHandler(err.message,500));
    }

});


exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    console.log("Reset passwor d");
    console.log(req.body)

    const token = req.params.token;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {
            $gt : Date.now(),
        }
    });
    if(!user) return next(new ErrorHandler(" Reset Password token is invalid or has been expired ",400));


    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Password is not matched",400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    sendToken(user,200,res);

});



// GET USER DETAILS (PROFILE)

exports.getUserDetails = async(req,res,next)=>{

    const user = req.user;
    res.status(200).json({
        success : true,
        user
    })
}   

// CHANGE PASSWORD

exports.updatePassword = async(req,res,next)=>{
    const user = req.user;
    const {oldPass,newPass,confirmPass} = req.body;

    const isPasswordMatched = user.passwordMatched(oldPass);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",404));
    }
    
    if(newPass !== confirmPass){
        return next(new ErrorHandler("New Password is not matched",400));
    }

    user.password = newPass;
    await user.save();
    sendToken(user,200,res);
}

// UPDATE USER PROFILE

exports.updateUserProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const avatarPublicID = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(avatarPublicID);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 150,
            crop : "scale"
        });

        newUserData.avatar = {
            public_id : myCloud.public_id,
            url : myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    });

    res.status(200).json({
        success : true,
        user
    })
});


// GET ALL USERS (Admin)

exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success : true,
        users
    })
});


// GET SINGLE USER (ADMIN)

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("User does not exist with this id",404));
    }
    res.status(200).json({
        success : true,
        user
    });
});

// UPDATE USER ROLE

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUser = {
        name : req.body.name,
        email: req.body.email,
        role : req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUser,{
        useFindAndModify : false,
        new : true,
        runValidators : true,
    });

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }


    res.status(200).json({
        success : true,
        user
    })
});


// DELETE USER -- ADMIN

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    // we will remove cloudnary later

    if(!user) return next(new ErrorHandler(`user does not exist with id ${req.params.id}`,404));

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    
    await user.remove();

    res.status(200).json({
        success : true,
        message : "User deleted Successfully"
    })
});



