const ErrorHandler = require("../utils/errorHandler");

const customErroHandler = (err,req,res,next)=>{

    // Wrong mongodb id error
    // console.log(err)
    if(err.name === "CastError"){
        const message = `Resourses not found. Invalid : ${err.path}`
        err = new ErrorHandler(message,400);
    }

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400);
    }

    // WRON JWT ERROR
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, Try Again`;
        err = new ErrorHandler(message,400);
    }

    // JWT EXPIRED ERROR 
    if(err.name === "TokenExpiredError"){
        const message =  `Json web token is Expired, Try Again`;
        err = new ErrorHandler(message,400);
    }

    
    err.message = err.message || "Internal Server Error ";
    err.statusCode = err.statusCode || 500;
    
    res.status(err.statusCode).json({
        success : false,
        message : err.message,
        error : err.stack,
        err,
    })
}

module.exports = customErroHandler;