import { Router } from 'express';
import { createUser, deleteUserById, getAllUsers, getUserById, upDateUserById } from '../controllers/user.controller.js';
import authUser from '../middlewares/autentication.middelware.js';
import authorizactionUser from '../middlewares/autorization.middleware.js';




const router = Router();

router.post('/', [authUser, authorizactionUser], createUser);
router.get('/', [authUser, authorizactionUser], getAllUsers );
router.get('/:id', [authUser, authorizactionUser],  getUserById);
router.delete('/:id', [authUser, authorizactionUser], deleteUserById);
router.patch('/:id', [authUser, authorizactionUser], upDateUserById);


export default router;