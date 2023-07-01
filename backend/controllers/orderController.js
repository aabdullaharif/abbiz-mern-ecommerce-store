const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("../middlewares/asyncHandler");
const ProductModel = require("../models/productModel");
const OrderModel = require("../models/orderModel");

// @desc Create Order
// @route POST /api/v1/order/create
// @access PRIVATE
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await OrderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// @desc My All Orders
// @route GET /api/v1/orders/me
// @access PRIVATE
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.find({ user: req.user._id });
  if (!order) {
    return next(new ErrorHandler(`You have not placed any order`), 404);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc Get Order Details
// @route GET /api/v1/order/:id
// @access PRIVATE
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No Order Found"), 404);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc Get All Orders
// @route GET /api/v1/admin/orders
// @access PRIVATE - ADMIN
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await OrderModel.find({});

  if (!orders) {
    return next(new ErrorHandler("No Order Found"), 400);
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// @desc Update Order Status
// @route PUT /api/v1/admin/order/:id
// @access PRIVATE - ADMIN
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order Found"), 400);
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You already have delivered this order"), 400);
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  if (status === "Shipped") {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Order Status Updated",
    order,
  });
});

async function updateStock(id, qty) {
  const product = await ProductModel.findById(id);
  product.stock -= qty;
  await product.save({ validateBeforeSave: false });
}

// @desc Delete a Order
// @route DELETE /api/v1/admin/order/:id
// @access PRIVATE - ADMIN
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order Found"), 400);
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order Deleted",
  });
});
