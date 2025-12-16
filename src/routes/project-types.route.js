import express from "express";

import { getAllProjectTypes } from "../controllers/project-types.controller.js";
const router = express.Router();

router.get("/",getAllProjectTypes);

export default router;