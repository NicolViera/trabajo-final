/**
 * ROUTES - Products
 * GET    /api/products        → Listar todos los productos
 * POST   /api/products        → Crear nuevo producto
 * PUT    /api/products/:id    → Actualizar producto
 * DELETE /api/products/:id    → Eliminar producto
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: normaliza producto DB → formato frontend (español)
function toFrontend(p) {
    return {
        id: p.id,
        sku: p.code,
        titulo: p.title,
        descripcion: p.description,
        categoria: { nombre: p.category },
        precio: p.price,
        stock: p.stock,
        urlImagen: p.image,
        salesCount: p.salesCount,
    };
}

// GET /api/products — Listar todos
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'asc' }
        });
        res.json(products.map(toFrontend));
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos', detail: err.message });
    }
});

// GET /api/products/:id — Obtener uno
router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener producto', detail: err.message });
    }
});

// POST /api/products — Crear nuevo
// Acepta tanto campos en inglés (code/title) como en español (sku/titulo) del AdminPanel
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const code        = body.code || body.sku;
        const title       = body.title || body.titulo;
        const description = body.description || body.descripcion || '';
        const category    = body.category || body.nombreCategoria;
        const price       = body.price || body.precio;
        const stock       = body.stock;
        const image       = body.image || body.urlImagen || '';

        if (!code || !title || !category || !price) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: titulo, sku, nombreCategoria, precio' });
        }
        const product = await prisma.product.create({
            data: {
                id: body.id || `prod-${Date.now()}`,
                code,
                title,
                description,
                category,
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                image,
                salesCount: 0
            }
        });
        res.status(201).json(toFrontend(product));
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'El código de producto ya existe' });
        }
        res.status(500).json({ error: 'Error al crear producto', detail: err.message });
    }
});

// PUT /api/products/:id — Actualizar
// Acepta tanto campos en inglés como en español del AdminPanel
router.put('/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = {};

        const title       = body.title       ?? body.titulo;
        const description = body.description ?? body.descripcion;
        const category    = body.category    ?? body.nombreCategoria;
        const price       = body.price       ?? body.precio;
        const stock       = body.stock;
        const image       = body.image       ?? body.urlImagen;
        const code        = body.code        ?? body.sku;
        const salesCount  = body.salesCount;

        if (title !== undefined)       data.title = title;
        if (description !== undefined) data.description = description;
        if (category !== undefined)    data.category = category;
        if (price !== undefined)       data.price = parseFloat(price);
        if (stock !== undefined)       data.stock = parseInt(stock);
        if (image !== undefined)       data.image = image;
        if (code !== undefined)        data.code = code;
        if (salesCount !== undefined)  data.salesCount = parseInt(salesCount);

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data
        });
        res.json(toFrontend(product));
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(500).json({ error: 'Error al actualizar producto', detail: err.message });
    }
});

// DELETE /api/products/:id — Eliminar
router.delete('/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(500).json({ error: 'Error al eliminar producto', detail: err.message });
    }
});

module.exports = router;
