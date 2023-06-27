const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/create").post(createProduct);
router.route("/product/:id").put(updateProduct);

module.exports = router;
