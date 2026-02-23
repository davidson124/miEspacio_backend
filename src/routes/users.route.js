import { Router } from 'express';
import { createUser, createArchitect, deleteUserById, getAllUsers, getUserById, updateUserById } from '../controllers/user.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import isAdmin from '../middlewares/authorization.middleware.js';
const router = Router();
// Registro público
router.post('/register', createUser);
// Crear arquitecto (solo admin)
router.post('/architect', authenticationUser, isAdmin, createArchitect);
// CRUD protegido solo admin
router.get('/', authenticationUser, isAdmin, getAllUsers);
router.get('/:id', authenticationUser, isAdmin, getUserById);
router.delete('/:id', authenticationUser, isAdmin, deleteUserById);
router.patch('/:id', authenticationUser, isAdmin, updateUserById);
export default router;