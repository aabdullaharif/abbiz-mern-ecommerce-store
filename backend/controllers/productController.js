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
// @route POST /api/v1/admin/product/create
// @access PRIVATE - ADMIN
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// @desc Update a Product
// @route PUT /api/v1/admin/product/:id
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
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    updatedProduct,
  });
});

// @desc Delete a Product
// @route DELETE /api/v1/admin/product/:id
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
      message: "Product Deleted",
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

// @desc Create/Update a RProducteview
// @route PUT /api/v1/product/review
// @access PRIVATE
exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await ProductModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review Created",
    product,
  });
});

// @desc Get all Review
// @route GET /api/v1/reviews
// @access PRIVATE
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    _id: product._id,
    reviews: product.reviews,
  });
});

// @desc Delete a Review
// @route DELETE /api/v1/product/reviews
// @access PRIVATE
exports.deleteProductReview = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await ProductModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review Deleted",
  });
});
