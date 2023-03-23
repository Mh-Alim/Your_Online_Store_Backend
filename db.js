const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongodb successfully connected ${data.connection.host}`);
    });
  mongoose.connection.on("error", function (error) {
    console.error("Database connection error:", error);
  });
};
mongoose.set("strictQuery", true);

module.exports = connectDB;
