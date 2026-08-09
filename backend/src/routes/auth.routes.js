import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateAuth } from '../validations/auth.validation.js';

const router = Router();
router.post('/register', validateAuth('register'), authController.register);
router.post('/login', validateAuth('login'), authController.login);
router.post('/logout', authController.logout);
export default router;
