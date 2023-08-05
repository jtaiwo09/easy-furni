const express = require("express");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const cloudinary = require("cloudinary").v2;
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

const Shop = require("../model/shop");
const { isSeller } = require("../middlewares/auth");

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
        await sendMail({
          email: seller.email,
          subject: "Activate your account",
          message: `Hello ${seller.name}, please click on the link to activate your account: ${activationUrl}`,
        });
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

module.exports = router;
