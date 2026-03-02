import fs from "fs";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { uploadImageToCloudinary } from "../services/upload.service.js";
export const uploadWorkImage = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Imagen requerida", 400);
  const uploaded = await uploadImageToCloudinary(req.file.path);
  // borrar archivo temporal
  fs.unlink(req.file.path, () => {});
  res.status(201).json({
    message: "Imagen subida correctamente",
    image: uploaded
  });
});