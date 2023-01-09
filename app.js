const express = require("express");
const app = express();
const customErroHandler = require("./middleware/error")
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser")

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));
app.use(fileUpload())

// ROUTE IMPORTS 
const productRoute = require("./Routes/productRoutes");
const userRoute = require("./Routes/userRoutes")
const orderRoute = require("./Routes/orderRoutes");
const paymentRoute = require("./Routes/paymentRoutes");
app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);
app.use("/api/v1",paymentRoute);



// ERROR MIDDLEWARE -> customErrorHandler
app.use(customErroHandler)




module.exports = app;