import cloudinary from "../config/cloudinary.config.js";

const buildThumbUrl = (secureUrl) => {
  return secureUrl.replace("/upload/", "/upload/w_900,q_auto,f_auto/");
};// Recibe URL Cloudinary y genera una versión optimizada; w_900 = ancho; q_auto = calidad; f_auto = formato

export const uploadFileToCloudinary = async (filePath, folder = "general") => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto"//Detecta tipo de archivo
  });

  const isImage = result.resource_type === "image";

  return {
    url: result.secure_url,
    thumbUrl: isImage ? buildThumbUrl(result.secure_url) : null,
    publicId: result.public_id,
    resourceType: result.resource_type
  }; 
};