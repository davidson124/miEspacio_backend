import multer from "multer"; //multer middleware node.JS
const upload = multer({
  dest: "tmp/",//Almacenamiento temporal
  limits: { fileSize: 10 * 1024 * 1024 }, // Alamacenamiento max 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf"//tipo de archivo
    ];// cb= callback de aprovación 
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Tipo de archivo no permitido."), false);
    }//file.mimetype = identificar la lista de allowedMimeTypes
    cb(null, true);// resultado de aprovación
  }
});
export default upload;