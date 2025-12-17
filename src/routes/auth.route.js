import { Router } from 'express';

import { createUser } from '../controllers/user.controller.js';
import { loginUser, reNewToken } from '../controllers/auth.controller.js';

import authUser from '../middlewares/autentication.middelware.js';
import authorizactionUser from '../middlewares/autorization.middleware.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', createUser);// sólo registra y no necesita 
router.get('/renew-token', authUser, authorizactionUser, reNewToken);


export default router;