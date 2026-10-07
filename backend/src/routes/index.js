import { Router } from 'express';
import authRoutes from './auth.routes.js';
import venueRoutes from './venue.routes.js';
import bookingRoutes from './booking.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/venues', venueRoutes);
router.use('/bookings', bookingRoutes);
router.use('/notification', notificationRoutes);

export default router;
