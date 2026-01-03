import express from "express";

import { createProjectTypes, getAllProjectTypes, patchProjectTypes, deleteProjectTypes } from "../controllers/project-types.controller.js";

const router = express.Router();

router.get("/",getAllProjectTypes);
router.post("/", createProjectTypes)
router.patch("/:idProject", patchProjectTypes)
router.delete("/:idproject",deleteProjectTypes)

export default router; 