import 'dotenv/config'; // debe ir PRIMERO: carga .env antes de leer JWT_SECRET
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'Chic Rose API (TypeScript) is running!' });
});

app.listen(PORT, () => {
    console.log(`\n🌸 Chic Rose API is running on http://localhost:${PORT}`);
});
