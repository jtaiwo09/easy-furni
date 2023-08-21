const express = require("express");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller } = require("../middlewares/auth");
const { filter } = require("../utils");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, ...rest } = req.body;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const product = await Product.create({ ...req.body, shop });
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// update product
router.put(
  "/update-product/:productId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findByIdAndUpdate(productId, {
        $set: req.body,
      });
      if (!product) {
        return next(new ErrorHandler("Product Id is invalid!", 400));
      }
      return res.status(200).json({ success: true, product });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }
      const ids = product.images.map((el) => el.public_id);
      await cloudinary.api.delete_resources(ids);

      await product.deleteOne();

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, Product, {
        shopId: req.params.id,
      });

      const products = await query;

      res.status(201).json({
        success: true,
        products,
        totalRecord: count,
        totalPages,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get a single product
router.get(
  "/get-single-product/:productId",
  catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, Product);

      // Add $ to query;
      // let queryStr = JSON.stringify(queryObj).replace(
      //   /\b(gte|gt|lte|lt)\b/g,
      //   (match) => `$${match}`
      // );

      // queryStr = JSON.parse(queryStr);

      const products = await query;

      res.status(201).json({
        success: true,
        products,
        totalRecord: count,
        totalPages,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = (avg / product.reviews.length).toFixed(1);

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
