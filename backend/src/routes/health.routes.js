import { Router } from 'express';
import { validate } from 'express-validation';
import { healthController } from '../controllers/health.controller.js';
import { healthValidation } from '../validations/health.validation.js';

const router = Router();

router.get('/', validate(healthValidation, {}, {}), healthController);

export default router;
