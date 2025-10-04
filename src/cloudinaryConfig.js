import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMediaToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resourcetype: "auto",
    });
    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  const resourceTypes = ["image", "video", "raw"];

  for (const type of resourceTypes) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: type,
      });

      console.log(`Checked ${publicId} as ${type}:`, result);

      // If successfully deleted, return immediately
      if (result.result === "ok") {
        console.log(`✓ Successfully deleted as ${type}`);
        return { ...result, resource_type: type };
      }

      // If not found, just continue to next type
      console.log(`✗ Not found as ${type}, trying next...`);
    } catch (error) {
      console.error(`Failed with type ${type}:`, error.message);
    }
  }

  // If we've tried all resource types and none worked
  return {
    result: "not found",
    message: `File ${publicId} not found as image, video, or raw file`,
  };
};
