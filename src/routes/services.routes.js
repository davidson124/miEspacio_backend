import { Router } from "express";
import authenticationUser from "../middlewares/authentication.middleware.js";
import isAdmin from "../middlewares/authorization.middleware.js";
import { getPublicServices, getAllServicesAdmin, createService, updateService, toggleServiceStatus, deleteService } from "../controllers/service.controller.js";
import { get } from "mongoose";

const router=Router()
router.get('/', getPublicServices);
router.post('/', authenticationUser, isAdmin, createService);
router.patch('/:id', authenticationUser, isAdmin, updateService);
router.delete('/:id', authenticationUser, isAdmin, deleteService);
router.get('/admin', authenticationUser, isAdmin, getAllServicesAdmin);
router.patch('/:id/toggle', authenticationUser, isAdmin, toggleServiceStatus);
export default router