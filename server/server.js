/**
 * SERVER.JS — Chic Rose API
 * Express + Prisma backend para la tienda Chic Rose.
 * Puerto: 3001
 *
 * Iniciar: node server.js
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ─── Rutas API ─────────────────────────────────────────────────────────────────
app.use('/api/products', require('./routes/productos'));
app.use('/api/users',    require('./routes/usuarios'));
app.use('/api/orders',   require('./routes/ordenes'));
app.use('/api/sales',    require('./routes/sales'));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
    res.json({
        name:    'Chic Rose API',
        version: '1.0.0',
        status:  'running',
        endpoints: [
            'GET    /api/products',
            'POST   /api/products',
            'PUT    /api/products/:id',
            'DELETE /api/products/:id',
            'GET    /api/users',
            'POST   /api/users',
            'POST   /api/users/login',
            'GET    /api/orders',
            'GET    /api/orders/user/:email',
            'POST   /api/orders',
            'PUT    /api/orders/:id',
            'GET    /api/sales'
        ]
    });
});

// ─── Ruta catch-all → sirve el frontend para cualquier ruta no-API ─────────────
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('🌸 ══════════════════════════════════════════ 🌸');
    console.log('        Chic Rose API — Servidor Activo');
    console.log('🌸 ══════════════════════════════════════════ 🌸');
    console.log(`\n   🚀  API:      http://localhost:${PORT}/api`);
    console.log(`   🛍️   Frontend: http://localhost:${PORT}`);
    console.log('\n   Credenciales de ejemplo:');
    console.log('   • Admin:   admin@chic.com / admin123');
    console.log('   • Cliente: cliente@chic.com / cliente123');
    console.log('\n🌸 ══════════════════════════════════════════ 🌸\n');
});
