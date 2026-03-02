import { Router } from "express";
import authenticationUser from "../middlewares/authentication.middleware.js";
import isAdmin from "../middlewares/authorization.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadWorkImage } from "../controllers/upload.controller.js";
const router = Router();
router.post(
  "/work-image",
  authenticationUser,
  isAdmin,
  upload.single("image"),
  uploadWorkImage
);
export default router;