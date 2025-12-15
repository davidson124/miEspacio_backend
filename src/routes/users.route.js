import { Router } from 'express';
import { createUser, deleteUserById, getAllUsers, getUserById, upDateUserById } from '../controllers/user.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';


const router = Router();

router.post('/',  [authenticationUser,authorizationUser], createUser );
router.get('/', [authenticationUser,authorizationUser],getAllUsers );
router.get('/:id', [authenticationUser,authorizationUser], getUserById);
router.delete('/:id', [authenticationUser,authorizationUser], deleteUserById);
router.patch('/:id',[authenticationUser,authorizationUser], upDateUserById);


export default router;