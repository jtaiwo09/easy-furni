const express = require("express");
// const path = require("path");
// const { upload } = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
// const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const cloudinary = require("cloudinary").v2;
const { filter } = require("../utils");
const crypto = require("crypto");
const PasswordResetToken = require("../model/passwordResetToken");
const bcrypt = require("bcrypt");

// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      // return res.status(400).json({ message: "User already exist" });
      return next(new ErrorHandler("User already exist", 400));
    }

    const myCloud = await cloudinary.uploader.upload(avatar, {
      resource_type: "auto",
      folder: "avatars",
    });

    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `${process.env.BASE_URL}/activation/${activationToken}`;

    try {
      const options = {
        email: user.email,
        subject: "Activate your account",
        template: "signup_email",
        context: {
          name: user.name,
          activationUrl: activationUrl,
        },
      };
      await sendMail(options);
      return res.status(200).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please fill the fields", 400));
      }
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(
          new ErrorHandler("Wrong credential, please try again", 400)
        );
      }
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Wrong credential, please try again", 400)
        );
      }
      sendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// fetch a user
router.get(
  "/get-user",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User doesn't not exist", 400));
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// update user
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Wrong password", 400));
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      delete user._doc.password;

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.uploader.destroy(imageId);

        const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(req.body.password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.addresses.length === 3) {
        return next(new ErrorHandler("Address limit reached ", 400));
      }
      const defaultAddress = user.addresses.find(
        (address) => address.default === true
      );
      if (defaultAddress && req.body.default) {
        const index = user.addresses.findIndex(
          (address) => address._id === defaultAddress._id
        );
        user.addresses[index].default = false;
        // user.addresses.splice(index, 1, req.body)
      }
      user.addresses.push(req.body);
      await user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update default address
router.put(
  "/update-default-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      const user = await User.findById(userId);

      const defaultAddress = user.addresses.find(
        (address) => address.default === true
      );

      if (defaultAddress) {
        const index = user.addresses.findIndex(
          (address) => address._id === defaultAddress._id
        );
        user.addresses[index].default = false;
      }

      const addressToUpdateIndex = user.addresses.findIndex(
        (address) => address._id.toString() === addressId
      );

      if (addressToUpdateIndex === -1) {
        return next(new ErrorHandler("Address not found", 400));
      }

      user.addresses[addressToUpdateIndex].default = true;

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// edit user address
router.put(
  "/edit-user-address",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      // check if there is default address
      const defaultAddress = user.addresses.find(
        (address) => address.default === true
      );

      // request to set new default address; remove default address
      if (defaultAddress && req.body.default) {
        const index = user.addresses.findIndex(
          (address) => address._id === defaultAddress._id
        );
        user.addresses[index].default = false;
      }

      // find index of address to edit
      const addressToUpdateIndex = user.addresses.findIndex(
        (address) => address._id.toString() === req.body.id
      );
      // throw error if address does not exist
      if (addressToUpdateIndex === -1) {
        return next(new ErrorHandler("Address not found", 400));
      }

      // Update address
      const { id, ...rest } = req.body;
      user.addresses[addressToUpdateIndex] = { _id: id, ...rest };

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      const tee = await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, count, totalPages } = await filter(req, next, User);
      const users = await query;
      res.status(201).json({
        success: true,
        users,
        totalRecord: count,
        totalPages,
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

    const user = await User.findOne({ email });

    // if(!user) return next(new ErrorHandler('user not found', 400))
    if (user) {
      const token = await PasswordResetToken.findOne({ userId: user._id });
      if (token) await token.deleteOne();

      let resetToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = await bcrypt.hash(resetToken, 10);

      await new PasswordResetToken({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
      }).save();

      const link = `${process.env.BASE_URL}/reset-password?token=${resetToken}&id=${user._id}`;

      const options = {
        email: user.email,
        subject: "Password Reset Request",
        template: "request_password_reset",
        context: {
          name: user.name,
          link,
        },
      };
      await sendMail(options, false);
    }
    return res.json({ success: true, message: "Mail sent" });
  })
);

// Reset password
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
    const user = await User.findById(userId);
    user.password = password;

    user.save({ validateBeforeSave: false });

    const options = {
      email: user.email,
      subject: "Password Reset Successfully",
      template: "password_reset",
      context: {
        name: user.name,
      },
    };
    await sendMail(options, false);

    await passwordResetToken.deleteOne();

    return res.json({ success: true, message: "Password reset successful" });
  })
);

module.exports = router;
