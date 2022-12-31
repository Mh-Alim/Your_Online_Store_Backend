const express = require("express");
const app = express();
const customErroHandler = require("./middleware/error")
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// ROUTE IMPORTS 
const productRoute = require("./Routes/productRoutes");
const userRoute = require("./Routes/userRoutes")
const shopRoute = require("./Routes/shopRoutes");
app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1",shopRoute)



// ERROR MIDDLEWARE -> customErrorHandler
app.use(customErroHandler)




module.exports = app;