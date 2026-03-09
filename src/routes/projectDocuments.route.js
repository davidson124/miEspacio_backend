import { Router } from "express";
import authenticationUser from "../middlewares/authentication.middleware.js";
import { isAdminOrArchitect } from "../middlewares/role.middleware.js";
import { createProjectDocument, getDocumentsByProject, getDocumentsForClient, setDocumentVisibility, deleteDocument } from "../controllers/projectDocuments.controller.js";
const router = Router();

router.use(authenticationUser);
router.delete("/:id", deleteDocument); // solo admin 
router.get("/", getDocumentsByProject);
router.patch("/:id/visibility", setDocumentVisibility); //Solo admin
router.post("/", isAdminOrArchitect, createProjectDocument);
router.get("/my", getDocumentsForClient, getDocumentsForClient);
export default router;