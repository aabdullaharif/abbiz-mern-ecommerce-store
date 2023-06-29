const express = require("express");
const productRoutes = require("./routes/productRoutes");
const errorMiddleware = require("./middlewares/error");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", productRoutes);

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
