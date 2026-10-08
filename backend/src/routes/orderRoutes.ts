import { Router } from 'express';
import { getOrders, getMyOrders, createOrder, updateOrderStatus, streamOrders } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Admin: SSE Notifications
router.get('/stream', streamOrders);

// Cliente: Crear orden y ver propias
router.post('/', authenticate, createOrder);
router.get('/me', authenticate, getMyOrders);

// Admin: Ver todas y actualizar estado
router.get('/', authenticate, requireAdmin, getOrders);
router.put('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
