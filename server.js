const app = require("./app");
const connectDB = require("./db");

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