/**
 * ROUTES - Orders
 * GET  /api/orders              → Listar todas las órdenes (admin)
 * GET  /api/orders/user/:email  → Órdenes de un cliente específico
 * POST /api/orders              → Crear nueva orden
 * PUT  /api/orders/:id          → Actualizar estado de orden
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/orders — Todas las órdenes
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { date: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener órdenes', detail: err.message });
    }
});

// GET /api/orders/user/:email — Órdenes de un cliente
router.get('/user/:email', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { customerEmail: req.params.email },
            include: { items: true },
            orderBy: { date: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener órdenes del cliente', detail: err.message });
    }
});

// POST /api/orders — Crear nueva orden
router.post('/', async (req, res) => {
    try {
        const { customerName, customerEmail, total, status, address, items, userEmail } = req.body;
        if (!customerName || !customerEmail || !total || !address || !items?.length) {
            return res.status(400).json({ error: 'Faltan campos obligatorios para crear la orden' });
        }

        // Generar ID estilo ORD-XXXX
        const count = await prisma.order.count();
        const orderId = `ORD-${9800 + count + 1}`;

        // Actualizar stock y salesCount de cada producto
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock:      { decrement: item.qty },
                    salesCount: { increment: item.qty }
                }
            });
        }

        // Actualizar o crear registro de venta del día
        const today = new Date();
        const rawDate = today.toISOString().split('T')[0];
        const dateLabel = today.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

        await prisma.saleDay.upsert({
            where: { rawDate },
            update: {
                revenue: { increment: total },
                count:   { increment: 1 }
            },
            create: { date: dateLabel, rawDate, revenue: total, count: 1 }
        });

        // Crear la orden
        const order = await prisma.order.create({
            data: {
                id: orderId,
                customerName,
                customerEmail,
                total: parseFloat(total),
                status: status || 'Pendiente',
                address,
                userEmail: userEmail || null,
                items: {
                    create: items.map(item => ({
                        productId: item.productId || item.id,
                        title:     item.title,
                        price:     parseFloat(item.price),
                        qty:       parseInt(item.qty),
                        size:      item.size,
                        color:     item.color
                    }))
                }
            },
            include: { items: true }
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la orden', detail: err.message });
    }
});

// PUT /api/orders/:id — Actualizar estado
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ error: 'Se requiere el campo status' });

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status },
            include: { items: true }
        });
        res.json(order);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.status(500).json({ error: 'Error al actualizar orden', detail: err.message });
    }
});

module.exports = router;
