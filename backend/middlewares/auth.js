const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

exports.isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource"), 401);
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await UserModel.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not Authorized to access this resource`,
          403 // Server understands the request, but refuse to process
        )
      );
    }
    next();
  };
};
