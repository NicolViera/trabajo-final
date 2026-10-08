/**
 * ROUTES - Users
 * GET  /api/users          → Listar todos los usuarios
 * POST /api/users          → Registrar usuario
 * POST /api/users/login    → Iniciar sesión (verificar credenciales)
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/users — Listar todos (solo para admin)
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'asc' }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios', detail: err.message });
    }
});

// POST /api/users/login — Iniciar sesión
// El frontend envía: { email, contrasena }
router.post('/login', async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        if (!email || !contrasena) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
                password: contrasena
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Devolvemos en el formato que espera el frontend: { user, token }
        const { password: _pw, ...safeUser } = user;
        // Mapeamos 'name' → 'nombre' y 'role' → 'rol' para compatibilidad con el frontend
        const userForFrontend = {
            id: safeUser.id,
            nombre: safeUser.name,
            email: safeUser.email,
            rol: safeUser.role,
        };
        res.json({ user: userForFrontend, token: `token-${safeUser.id}` });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión', detail: err.message });
    }
});

// POST /api/users — Registrar nuevo usuario
// El frontend envía: { nombre, email, contrasena }
router.post('/', async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;
        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, contrasena' });
        }
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(409).json({ error: 'Este correo electrónico ya está registrado' });
        }
        const user = await prisma.user.create({
            data: { name: nombre, email, password: contrasena, role: 'customer' }
        });
        const { password: _pw, ...safeUser } = user;
        res.status(201).json(safeUser);
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario', detail: err.message });
    }
});

module.exports = router;
