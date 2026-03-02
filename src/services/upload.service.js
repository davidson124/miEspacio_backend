import cloudinary from "../config/cloudinary.config.js";
export const uploadImageToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "mi-espacio/works",
    resource_type: "image",
    transformation: [
      { quality: "auto", fetch_format: "auto" }
    ]
  });
  return {
    url: result.secure_url,
    thumbUrl: result.secure_url.replace("/upload/", "/upload/w_900,q_auto,f_auto/"),
    publicId: result.public_id
  };
};