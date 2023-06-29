const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("../middlewares/asyncHandler");
const ProductModel = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get All Products
// @route GET /api/v1/products
// @access PUBLIC
exports.getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await ProductModel.countDocuments();

  const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    productCount,
    products,
  });
});

// @desc Create a Product
// @route POST /api/v1/product/create
// @access PRIVATE - ADMIN
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// @desc Update a Product
// @route PUT /api/v1/product/:id
// @access PRIVATE - ADMIN
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
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
});

// @desc Delete a Product
// @route DELETE /api/v1/product/:id
// @access PRIVATE - ADMIN
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const deletedProduct = await product.deleteOne();

  if (deletedProduct) {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

// @desc Get a Product
// @route GET /api/v1/product/:id
// @access PUBLIC
exports.getProductDetails = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
