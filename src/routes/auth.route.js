import { Router } from 'express';
import { createUser } from '../controllers/user.controller.js';
import { loginUser } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', createUser);

export default router;