import cloudinary from "../config/cloudinary.config.js";

export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType
  });
};