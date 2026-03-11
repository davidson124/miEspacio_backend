import { Router } from "express";
import authenticationUser from "../middlewares/authentication.middleware.js";
import { isAdminOrArchitect } from "../middlewares/role.middleware.js";
import { createProjectFromQuote, getMyProjects, getAssignedProjects, getAllProjects, getProjectById, updateProjectProgress, addProjectGalleryImages, removeProjectGalleryImage } from "../controllers/projects.controller.js";
const router = Router();
router.use(authenticationUser);
// ADMIN/ARCHITECT
router.post("/from-quote/:quoteId", isAdminOrArchitect, createProjectFromQuote);
router.get("/assigned", getAssignedProjects); // controller limita a architect
router.get("/", getAllProjects); // controller limita a admin
// CLIENTE/ADMIN/ARCHITECT
router.get("/my", authenticationUser, getMyProjects);
router.get("/:id", getProjectById);
// ADMIN/ARCHITECT: progreso + galería
router.patch("/:id/progress", authenticationUser, updateProjectProgress);
router.post("/:id/gallery", isAdminOrArchitect, addProjectGalleryImages);
router.delete("/:id/gallery/:imageIndex", isAdminOrArchitect, removeProjectGalleryImage);
router.post("/from-quote/:quoteId", isAdminOrArchitect, createProjectFromQuote);
export default router;