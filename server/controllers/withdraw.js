const Shop = require("../model/shop");
const express = require("express");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const { isSeller, isAuthenticated, isAdmin } = require("../middlewares/auth");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { currencyConverter } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const { filter } = require("../utils");
const router = express.Router();

// create withdraw request --- only for seller
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;

      const data = {
        seller: req.seller,
        amount,
      };

      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${
            req.seller.name
          }, Your withdraw request of ${currencyConverter(
            amount.toString()
          )} is processing. It will take 3days to 7days for processing! `,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      const withdraw = await Withdraw.create(data);

      const shop = await Shop.findById(req.seller._id);

      shop.availableBalance = shop.availableBalance - amount;

      await shop.save();

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/get-seller-withdrawals",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, Withdraw, {
        "seller._id": req.seller._id,
      });
      const withdrawals = await query;
      return res.status(200).json({
        success: true,
        withdrawals,
        totalRecord: count,
        totalPages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all withdraws for --- admnin
router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, Withdraw);

      const withdraws = await query;

      res.status(201).json({
        success: true,
        withdraws,
        totalRecord: count,
        totalPages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "Success",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transaction = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transactions = [...seller.transactions, transaction];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Withdrawal Request",
          template: "payment_request",
          context: {
            name: seller.name,
            amount: currencyConverter(withdraw.amount),
          },
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
