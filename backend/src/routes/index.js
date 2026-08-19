import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import venueRoutes from './venue.routes.js';
import bookingRoutes from './booking.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/venues', venueRoutes);
router.use('/bookings', bookingRoutes);

export default router;
