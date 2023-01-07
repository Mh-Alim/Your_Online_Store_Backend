const app = require("./app");
const connectDB = require("./db");
const cloudinary = require("cloudinary")

// DOTENV
const dotenv = require("dotenv");
dotenv.config();

// HANDLING UNCAUGHT ERROR
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
})
// CONNECT DB
connectDB();



// CLOUDINARY SETUP

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})



const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})


// HADLING UNHANDLED ERROR
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
    });
})

