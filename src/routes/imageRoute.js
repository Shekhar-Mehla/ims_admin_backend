import express from "express";
import multer from "multer";
import {
  deleteImageController,
  imageUploadController,
} from "../controllers/imageController.js";
const imageRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("only .jpeg  .png and .pdf are allowed format allowed!"));
    }
  },
});

//upload image route
imageRouter.post("/", upload.array("application", 6), imageUploadController);

// delete image route
imageRouter.delete("/delete/:id", deleteImageController);

export default imageRouter;
