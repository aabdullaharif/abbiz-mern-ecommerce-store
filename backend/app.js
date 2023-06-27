const express = require("express");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", productRoutes);

module.exports = app;
