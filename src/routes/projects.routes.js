import { Router } from "express";
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "../controllers/projects.controller.js";


const router = Router();

router.post('/',createProject);
router.get('/',getAllProjects);
router.get('/:idProject', getProjectById)
router.delete('/:idProject',deleteProject)
router.patch('/:idProject',updateProject)



export default router