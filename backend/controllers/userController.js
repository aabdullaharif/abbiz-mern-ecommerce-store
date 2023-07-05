const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("../middlewares/asyncHandler");
const UserModel = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// @desc Register User
// @route POST /api/v1/register
// @access PUBLIC
exports.registerUser = asyncHandler(async (req, res, next) => {
  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale",
  // });
  const { name, email, password } = req.body;
  const user = await UserModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "Sample png",
      url: "sample.png",
    },
  });

  sendToken(user, 201, res);
});

// @desc Login User
// @route POST /api/v1/login
// @access PUBLIC
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password"), 400); // 400 - Bad Request
  }

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401)); // 401 - Unauthorized
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

// @desc Logout User
// @route POST /api/v1/logout
// @access PUBLIC
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// @desc Forgot Password
// @route POST /api/v1/password/forgot
// @access PUBLIC
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not Found"), 404);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Reset Password URL is:- \n\n ${resetPasswordUrl} \n\n`;

  try {
    await sendEmail({
      email: user.email,
      subject: process.env.EMAIL_SUBJECT,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent to User: ${user.email} successfully`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message), 500); // Internal Server Error
  }
});

// @desc Reset Password
// @route PUT /api/v1/password/reset/:token
// @access PUBLIC
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is Invalid or has been Expired"),
      400
    );
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password does not match with Confirm Password"),
      400
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// @desc Get User Details
// @route PUT /api/v1/me
// @access PRIVATE
exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc Update Password
// @route PUT /api/v1/password/update
// @access PRIVATE
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, newConfirmPassword } = req.body;
  const user = await UserModel.findById(req.user._id).select("+password");
  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password does not matched"), 400);
  }

  if (newPassword !== newConfirmPassword) {
    return next(
      new ErrorHandler("New Password does not match with New Confirm Password"),
      400
    );
  }

  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// @desc Update User Profile
// @route PUT /api/v1/me/update
// @access PRIVATE
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  const newUserData = {
    email,
    name,
  };

  // TODO: Cloudinary

  const user = await UserModel.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc Get All Users
// @route GET /api/v1/admin/users
// @access PRIVATE - ADMIN
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find({});
  res.status(200).json({
    success: true,
    users,
  });
});

// @desc Get Single Users
// @route GET /api/v1/admin/user/:id
// @access PRIVATE - ADMIN
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);

  if (!user) {
    return next(new ErrorHandler(`No User Found with ${id}`), 400);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// @desc Update User Role
// @route PUT /api/v1/admin/user/:id
// @access PRIVATE - ADMIN
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { email, name, role } = req.body;
  const newUserData = {
    email,
    name,
    role,
  };

  const user = await UserModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Role Updated",
    user,
  });
});

// @desc Delete a User
// @route PUT /api/v1/admin/user/:id
// @access PRIVATE - ADMIN
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);

  if (!user) {
    return next(new ErrorHandler(`No User Found with ${id}`), 400);
  }

  await user.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "User Deleted",
    user,
  });
});
