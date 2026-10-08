/**
 * ROUTES - Sales
 * GET /api/sales → Listar registros de ventas diarias (últimos 5 días)
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/sales — Obtener datos de ventas diarias
router.get('/', async (req, res) => {
    try {
        const sales = await prisma.saleDay.findMany({
            orderBy: { rawDate: 'asc' }
        });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener ventas', detail: err.message });
    }
});

module.exports = router;
