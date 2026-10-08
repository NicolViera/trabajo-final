import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Públicas
router.get('/', getProducts);

// Privadas (Solo Admin)
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;
