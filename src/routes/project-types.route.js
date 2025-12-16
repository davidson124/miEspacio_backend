import express from "express";

import { createProjectTypes, getAllProjectTypes } from "../controllers/project-types.controller.js";
const router = express.Router();

router.get("/",getAllProjectTypes);
router.post("/", createProjectTypes)

export default router;