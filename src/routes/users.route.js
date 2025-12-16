import { Router } from 'express';
import { createUser, deleteUserById, getAllUsers, getUserById, upDateUserById } from '../controllers/user.controller.js';



const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers );
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.patch('/:id', upDateUserById);


export default router;