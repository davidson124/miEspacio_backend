import { Router } from "express"; 
import authenticationUser from '../middlewares/authentication.middleware.js';
import isAdmin from '../middlewares/authorization.middleware.js';
import {createWork, getPublicWorks, getWorkByIdPublic,updateWork, deleteWork } from '../controllers/works.controller.js'
const router = Router();
//público
router.get('/', getPublicWorks);
router.get('/:id', getWorkByIdPublic);
//Admin
router.post('/', authenticationUser, isAdmin, createWork);
router.patch('/:id', authenticationUser, isAdmin, updateWork);
router.delete('/:id', authenticationUser, isAdmin, deleteWork);
export default router;