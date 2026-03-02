import multer from "multer";
const upload = multer({
  dest: "tmp/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo imágenes permitidas"), false);
    }
    cb(null, true);
  }
});
export default upload;