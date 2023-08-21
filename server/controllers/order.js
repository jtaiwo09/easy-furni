const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");
const Token = require("../model/token");
const { isSeller, isAuthenticated, isAdmin } = require("../middlewares/auth");
const { commission, filter } = require("../utils");
const ErrorHandler = require("../utils/ErrorHandler");
const { nanoid } = require("nanoid");
const sendMail = require("../utils/sendMail");
const cron = require("node-cron");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo, shipping } =
        req.body;

      cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];
      const id = nanoid(8);
      const token = id.toUpperCase();

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shopId,
          shippingAddress,
          user,
          totalPrice: totalPrice - shipping,
          paymentInfo,
          paidAt: paymentInfo.paid ? Date.now() : null,
        });
        // if (paymentInfo.paid) {
        //   order.paidAt = Date.now();
        // }

        orders.push(order);

        // Create token to be used to confirm delivery
        await Token.create({
          _id: order._id,
          token,
          user,
          shopId,
        });

        // Sum the total price of items purchased from a seller's shop
        const totalPurchasedCost = items.reduce(
          (total, el) =>
            total +
            (el.discountPrice ? el.discountPrice : el.originalPrice * el.qty),
          0
        );

        // Send notification email to seller on order creation
        const seller = await Shop.findById(shopId);
        const sellerOptions = {
          email: seller.email,
          subject: "Order Recieved",
          message: `Hi ${
            seller.name
          }, you have an new order, please login to your dashboard ${
            process.env.BASE_URL + "/dashboard"
          } to attend to this. Prepare the product and send to our warehouse for delivery`,
        };

        await sendMail(sellerOptions);
      }

      // Send notification email to buyer on order creation
      const buyerOptions = {
        email: user.email,
        subject: "Order Recieved",
        message: `Hi ${user.name}, your order has been received. Your Order Token is ${token}, please only provide this token for delivery confirmation.`,
      };

      await sendMail(buyerOptions);

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      let query = Order.find({
        "cart.shopId": req.params.shopId,
      });

      // Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 2;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      let count;

      if (req.query.page || page) {
        count = await Order.countDocuments();
        if (skip > count) {
          next(new ErrorHandler("This page does not exist"));
        }
      }

      const orders = await query.sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
        totalRecord: count,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get a order for seller
router.get(
  "/get-seller-order/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all user orders
router.get(
  "/get-user-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get user order
router.get(
  "/get-user-order/:orderId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.orderId);

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { orderId, productIds, reason, status } = req.body;
      const order = await Order.findById(orderId);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      const tee = [];

      let shop;

      productIds.forEach(async (id) => {
        const product = order.cart.find((el) => el._id === id);
        if (product) {
          tee.push(product);
          shop = product.shop;
        }
      });

      try {
        const sellerOptions = {
          email: shop.email,
          subject: "Product Return",
          template: "product_return",
          context: {
            name: shop.name,
            product: tee,
            reason,
          },
        };

        await sendMail(sellerOptions);
      } catch (error) {
        next(new ErrorHandler(error.message, 400));
      }

      // order.status = status;

      // await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Validate token for delivery confirmation
router.get(
  "/token-verification/:token",
  catchAsyncErrors(async (req, res, next) => {
    const token = req.params?.token.toUpperCase();
    const userToken = await Token.find({ token }).populate({
      path: "shopId",
    });

    if (userToken.length < 1)
      return next(new ErrorHandler("Wrong token provided", 400));

    const checkVerifiedToken = userToken.every((el) => el.verified === true);

    if (checkVerifiedToken) {
      return res.json({ success: true, message: "delivery is completed..." });
    }

    await Token.updateMany({ token }, { verified: true });

    userToken.forEach(async (token) => {
      const order = await Order.findById(token._id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      // Update order status
      order.status = "Delivered";

      if (!order.paymentInfo.paid) {
        order.paymentInfo.paid = true;
        order.paidAt = Date.now();
        order.paymentInfo.status = "success";
      }
      order.deliveredAt = Date.now();

      order.save({ validateBeforeSave: false });

      // Sum the total price of items purchased from a seller's shop
      const totalPurchasedCost = order.cart.reduce(
        (total, el) =>
          total +
          (el.discountPrice ? el.discountPrice : el.originalPrice * el.qty),
        0
      );
      // Make payment to seller on delivery completion.
      const serviceCharge = totalPurchasedCost * commission;
      await makePaymentToSeller(
        totalPurchasedCost - serviceCharge,
        token.shopId._id
      );

      // send mail to buyer and seller on delivery completion
      const sellerOptions = {
        email: token.shopId.email,
        subject: "Delivery Completed",
        message: `Hi, ${token.shopId.name}, Your delivery has completed, and buyer has recieved his/her item(s). Thank You...`,
      };

      const buyerOptions = {
        email: token.user.email,
        subject: "Delivery Completed",
        message: `Hi, ${token.user.name}, Your delivery has been completed. Thank You...`,
      };

      await sendMail(sellerOptions);
      await sendMail(buyerOptions);
    });

    // await Token.findOneAndDelete({ token });

    res.status(200).json({
      success: true,
      message: "delivery is completed",
    });
  })
);

router.get("/tee", (req, res) => {
  setTimeout(() => {
    cron.schedule("*/5 * * * * *", () => {
      console.log("Working....");
    });
  }, 1.02e6);
  return res.json({ succes: true });
});

// HELPER FUNCTIONS
// Update product stock
async function updateOrder(id, qty) {
  const product = await Product.findById(id);

  product.stock -= qty;
  product.sold_out += qty;

  await product.save({ validateBeforeSave: false });
}

// Update Seller Balance
async function makePaymentToSeller(amount, sellerId) {
  const seller = await Shop.findById(sellerId);

  seller.availableBalance += amount;

  await seller.save();
}

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, Order);
      const orders = await query.sort({
        deliveredAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
        totalRecord: count,
        totalPages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
