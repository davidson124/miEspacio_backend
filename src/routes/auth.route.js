import { Router } from 'express';
import { createUser } from '../controllers/user.controller.js';
import { loginUser, reVewToken } from '../controllers/auth.controller.js';
import authUser from '../middelwares/autentication.middelware.js';
import authorizactionUser from '../middelwares/autorization.middleware.js';

const router = Router();

router.post('/login',loginUser);
router.post('/register',createUser);
router.get('/revew-token',authUser, authorizactionUser, reVewToken );

export default router;