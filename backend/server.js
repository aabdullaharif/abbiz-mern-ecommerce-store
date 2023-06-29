const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Uncaught Expections
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server, Uncaught Exceptions");
  process.exit(1);
});

dotenv.config();
connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server in ${process.env.MODE} at PORT:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server, Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
