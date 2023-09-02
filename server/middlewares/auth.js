const Shop = require("../model/shop");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        req.user = await User.findById(decoded.id);
        next();
      } else {
        next(new ErrorHandler("Unauthorised", 401));
      }
    } else {
      next(new ErrorHandler("Unauthorised", 401));
    }
  } else {
    next(new ErrorHandler("Unauthorised", 401));
  }
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const seller_token = req.headers.authorization.split("Bearer ")[1];
    if (seller_token) {
      const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
      if (decoded.role === "Seller") {
        req.seller = await Shop.findById(decoded.id);
        next();
      } else {
        next(new ErrorHandler("Unauthorised", 401));
      }
    } else {
      next(new ErrorHandler("Unauthorised", 401));
    }
  } else {
    next(new ErrorHandler("Unauthorised", 401));
  }
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }
    next();
  };
};
