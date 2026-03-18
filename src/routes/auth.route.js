import { Router } from 'express';
import { createUser } from '../controllers/user.controller.js';
import { loginUser, renewToken, getMe } from '../controllers/auth.controller.js';
import authenticationUser from '../middlewares/authentication.middleware.js';
import authorizationUser from '../middlewares/authorization.middleware.js';

const router = Router();
//Rutas para autenticacion
router.post('/login', loginUser)
router.post('/register', createUser);  
router.get('/me', authenticationUser, getMe);
router.get( '/renew-token', authenticationUser, authorizationUser, renewToken)
export default router;