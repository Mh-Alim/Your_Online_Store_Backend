const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeature = require("../utils/apiFeatures");


// SHOP OWNER ROUTE
exports.createProduct = catchAsyncErrors( async (req,res,next)=>{
    req.body.user = req.user._id;
    console.log(req.body)
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


exports.getAllProduct = catchAsyncErrors( async (req,res)=>{
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeature(Product,req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success : true,
        products,
        productCount
    })
})


exports.updateProduct = catchAsyncErrors( async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found!!",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators: true,
        useFindAndModify : false,
    })

    return res.status(200).json({
        success : true,
        product
    })
})



exports.deleteProduct = catchAsyncErrors( async(req,res)=>{
    const product = await Product.findById(req.params.id);


    if(!product){
        return next(new ErrorHandler("Product not found!!",404));
    }


    await product.remove();

    return res.status(200).json({
        success : true,
        message : "Product Deleted Successfully"
    })

})

// GET SINGLE PRODUCT 
exports.getProductDetails = catchAsyncErrors( async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found!!",404));
    }


    return res.status(200).json({
        success : true,
        product
    })

})

//  CREATE NEW REVIEW OR UPDATE THE REVIEW

exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {rating,comment,productId} = req.body;
    const review = {
        user : req.user._id,
        name : req.user.name,
        rating: Number(rating),
        comment
    }
    

    const product = await Product.findById(productId);
    let isReviewed = false;
    product.reviews.forEach((rev)=>{
        if( rev.user.toString() === req.user._id.toString() ) isReviewed = true;
    });

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if( rev.user.toString() === req.user._id.toString() ){
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += rev.rating;
    });
    avg /= product.reviews.length;
    product.ratings = avg;

    await product.save({validateBeforeSave : false});

    return res.status(200).json({
        success : true,
    })
});


// GET ALL PRODUCT REVIEWS

exports.getAllReviews = catchAsyncErrors(async(req,res,next)=>{
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success : true,
        reviews : product.reviews
    })
});


// DELTE PRODUCT REVIEW

exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const productId = req.query.productId;
    console.log(productId);
    const product = await Product.findById(productId);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter((rev)=>{
        return rev._id.toString() !== req.query.id
    });

    // changing product ratings
    let avg = 0;
    reviews.forEach((rev)=>{
        avg += rev.rating;
    });
    avg /= reviews.length;


    product.ratings = avg;
    product.numOfReviews = reviews.length;
    product.reviews = reviews;



    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success : true,
    })
});