import { Router } from "express";
import { createDocumentations, deleteDocumentationById, getAllDocumentations, getDocumentationsById, upDateDocumentation } from "../controllers/documentations.controller.js";



const router = Router();

router.post('/', createDocumentations);
router.get('/', getAllDocumentations);
router.get('/:id', getDocumentationsById);
router.delete('/:id', deleteDocumentationById);
router.patch('/:id', upDateDocumentation);

export default router;