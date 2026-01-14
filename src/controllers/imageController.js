import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../cloudinaryConfig.js";
import responseClient from "../utility/responseClient.js";
import fs from "fs/promises";
export const imageUploadController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return responseClient({
        res,
        statusCode: 400,
        message: "No file uploaded",
      });
    }
    const fileUrls = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadMediaToCloudinary(file.path);
        await fs.unlink(file.path); // delete the file after upload
        return result;
      })
    );
    responseClient({
      res,
      message: "Files uploaded successfully",
      payload: fileUrls,
    });
  } catch (error) {
    next(error);
  }
};

// delete image controller
export const deleteImageController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseClient({
        res,
        statusCode: 400,
        message: "No id provided",
      });
    }
    const result = await deleteMediaFromCloudinary(id);
    if (result.result === "not found") {
      return responseClient({
        res,
        statusCode: 500,
        message: "Image not found",
      });
    }
    if (result.result == "ok" || result.result == "deleted") {
      return responseClient({
        res,
        message: "Image deleted successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};
