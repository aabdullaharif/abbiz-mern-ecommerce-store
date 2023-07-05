const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary");

// Uncaught Expections
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server, Uncaught Exceptions");
  process.exit(1);
});

dotenv.config();
connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is started in ${process.env.NODE_ENV} at PORT:${process.env.PORT}`
  );
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server, Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
