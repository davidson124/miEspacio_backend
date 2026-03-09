import fs from "fs"; // Módulo para gestionar, eliminar, crar, archivos.
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { uploadFileToCloudinary } from "../services/upload.service.js";

export const uploadFiles = catchAsync(async (req, res) => {
  const { folder } = req.body;//Leer carpeta del body
  if ((!req.files || req.files.length === 0) && !req.file) {
    throw new AppError("Archivo requerido.", 400);
  }// Validación del archivo
  const filesToUpload = req.files || [req.file];//Normalizar a un array
  const uploadedFiles = [];//Acumulador de resultado
  //recorrer filesToUpload, para subir archivo a temporal, carpeta de destino o general. 
  for (const file of filesToUpload) {
    const uploaded = await uploadFileToCloudinary(
      file.path,
      folder || "general"
    );
    uploadedFiles.push(uploaded);//Guardar archivos al final del array
    fs.unlink(file.path, () => {});//Elimina el archivo de la carpeta temporal
  }
  res.status(201).json({
    message: "Archivo(s) subido(s) correctamente.",
    files: uploadedFiles
  });
});