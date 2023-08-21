const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const router = require("express").Router();
const cloudinary = require("cloudinary").v2;

router.post(
  "/upload",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const path = req.body.path;
      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: path,
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      return res.json({ success: true, images: imagesLinks });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);

router.delete(
  "/delete",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { publicId } = req.body;
      if (!publicId) {
        return next(new ErrorHandler("Something went wrong", 500));
      }
      await cloudinary.uploader.destroy(publicId);
      return res.status(200).json({ success: true, message: "Image deleted" });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);

module.exports = router;
