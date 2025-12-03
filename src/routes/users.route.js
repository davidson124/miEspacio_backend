import { Router } from 'express';
import { createUser, deleteUserById, getAllUsers, getUserById } from '../../controllers/user.controller.js';


const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers );
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);


export default router;