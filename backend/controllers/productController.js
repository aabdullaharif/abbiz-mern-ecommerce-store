const ProductModel = require("../models/productModel");

// @desc Get All Products
// @route GET /api/v1/products
// @access PUBLIC
exports.getAllProducts = async (req, res) => {
  const products = await ProductModel.find({});

  res.status(200).json({
    success: true,
    products,
  });
};

// @desc Create a Product
// @route POST /api/v1/product/create
// @access PRIVATE - ADMIN
exports.createProduct = async (req, res, next) => {
  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

// @desc Update a Product
// @route PUT /api/v1/product/:id
// @access PRIVATE - ADMIN
exports.updateProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );

  res.status(200).json({
    success: true,
    updatedProduct,
  });
};
