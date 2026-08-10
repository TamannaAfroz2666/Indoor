import { Router } from 'express';
import { handleValidation, registerValidation, loginValidation,} from '../validations/auth.validation.js';
import { getLoginController, getRegisterController, loginController, registerController } from '../controllers/auth.controller.js';

const router = Router();

router.post( '/register',registerValidation, handleValidation, registerController);

router.get( '/register', getRegisterController);
router.post('/login', loginValidation, handleValidation, loginController);
router.get( '/login', getLoginController);
router.post('/logout',);

export default router;