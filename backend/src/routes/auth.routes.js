import { Router } from 'express';
import { handleValidation, registerValidation, loginValidation,} from '../validations/auth.validation.js';
import { getLoginController, getRegisterController, loginController, logoutController, meController, registerController, updateAvatarController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post( '/register',registerValidation, handleValidation, registerController);

router.get( '/register', getRegisterController);
router.post('/login', loginValidation, handleValidation, loginController);
router.get( '/login', getLoginController);
router.get('/me', requireAuth, meController);
router.patch('/me/avatar', requireAuth, updateAvatarController);
router.post('/logout', logoutController);

export default router;
