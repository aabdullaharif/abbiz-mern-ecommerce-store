const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductDetails,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/create").post(createProduct);
router
  .route("/product/:id")
  .put(updateProduct)
  .get(getProductDetails)
  .delete(deleteProduct);

module.exports = router;
