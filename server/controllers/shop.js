const express = require("express");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const cloudinary = require("cloudinary").v2;
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const Shop = require("../model/shop");
const { isSeller, isAuthenticated, isAdmin } = require("../middlewares/auth");
const { filter } = require("../utils");
const crypto = require("crypto");
const PasswordResetToken = require("../model/passwordResetToken");
const bcrypt = require("bcrypt");

// create user shop
router.post(
  "/create",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address, password, avatar } = req.body;
      const sellerEmail = await Shop.findOne({ email });
      if (sellerEmail) {
        return next(new ErrorHandler("User already exist", 400));
      }

      const myCloud = await cloudinary.uploader.upload(avatar, {
        resource_type: "auto",
        folder: "avatars",
      });

      const seller = {
        name,
        phoneNumber,
        address,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };

      const activationToken = createActivationToken(seller);
      const activationUrl = `${process.env.BASE_URL}/activation/seller/${activationToken}`;

      try {
        const options = {
          email: seller.email,
          subject: "Activate your account",
          template: "signup_email",
          context: {
            name: seller.name,
            activationUrl: activationUrl,
          },
        };
        await sendMail(options);
        return res.status(200).json({
          success: true,
          message: `please check your email:- ${seller.email} to activate your account!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, address, phoneNumber } = newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }
      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login seller
router.post(
  "/login",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(
          new ErrorHandler("Wrong credentials, please try again", 400)
        );
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Wrong credentials, please try again", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get seller
router.get(
  "/get-seller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }
      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

      const imageId = existsSeller.avatar.public_id;

      await cloudinary.uploader.destroy(imageId);

      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info -- seller
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findByIdAndUpdate(
        req.seller._id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info -- admin
router.put(
  "/update-seller-info/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(
        req.seller._id,
        {
          withdrawMethod,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw methods --- only seller
router.delete(
  "/delete-withdraw-method",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, Shop);

      const sellers = await query;

      res.status(201).json({
        success: true,
        sellers,
        totalRecord: count,
        totalPages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Request password reset
router.post(
  "/request-reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email;

    const shop = await Shop.findOne({ email });

    // if(!shop) return next(new ErrorHandler('shop not found', 400))
    if (shop) {
      const token = await PasswordResetToken.findOne({ userId: shop._id });
      if (token) await token.deleteOne();

      const resetToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = await bcrypt.hash(resetToken, 10);

      await new PasswordResetToken({
        userId: shop._id,
        token: hashedToken,
        createdAt: Date.now(),
      }).save();

      const link = `${process.env.BASE_URL}/shop/reset-password?token=${resetToken}&id=${shop._id}`;

      const options = {
        email: shop.email,
        subject: "Password Reset Request",
        template: "request_password_reset",
        context: {
          name: shop.name,
          link,
        },
      };
      await sendMail(options, false);
    }
    return res.json({ success: true, message: "Mail sent" });
  })
);

// Reset Password
router.post(
  "/reset-password",
  catchAsyncErrors(async (req, res, next) => {
    const { token, userId, password } = req.body;

    if (!token || !userId) {
      return next(new ErrorHandler("Invalid Link", 400));
    }

    const passwordResetToken = await PasswordResetToken.findOne({ userId });

    if (!passwordResetToken) {
      return next(
        new ErrorHandler("Invalid or expired password reset link", 400)
      );
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      return next(
        new ErrorHandler("Invalid or expired password reset link", 400)
      );
    }
    const shop = await Shop.findById(userId);
    shop.password = password;

    shop.save({ validateBeforeSave: false });

    const options = {
      email: shop.email,
      subject: "Password Reset Successfully",
      template: "password_reset",
      context: {
        name: shop.name,
      },
    };
    await sendMail(options, false);

    await passwordResetToken.deleteOne();

    return res.json({ success: true, message: "Password reset successful" });
  })
);

module.exports = router;
