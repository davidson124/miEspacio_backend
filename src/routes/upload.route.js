import { Router } from "express";
import authenticationUser from "../middlewares/authentication.middleware.js";
import { isAdminOrArchitect } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { uploadFiles } from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/",
  authenticationUser,
  isAdminOrArchitect,
  upload.array("files", 10),//Acepta hasta 10 archivos 
  uploadFiles
);

export default router;