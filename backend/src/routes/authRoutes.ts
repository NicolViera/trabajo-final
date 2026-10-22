import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { rateLimit } from '../middlewares/rateLimit';

const router = Router();

router.post('/register', rateLimit(10, 15 * 60 * 1000), register);
router.post('/login', rateLimit(10, 15 * 60 * 1000), login);

export default router;
