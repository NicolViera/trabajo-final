import { Request, Response } from 'express';
import { orderService, OrderError } from '../services/orderService';
import { PaymentError } from '../services/paymentService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { verifyToken } from '../utils/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let adminClients: Response[] = [];

// EventSource no permite enviar headers, así que el token viaja en ?token=
export const streamOrders = (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(String(req.query.token || '')) as { role?: string };
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Solo administradores' });
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  adminClients.push(res);

  req.on('close', () => {
    adminClients = adminClients.filter(client => client !== res);
  });
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });

    // Nombre y email salen de la BD, no del body (el cliente no puede falsearlos)
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

    const { pedido, pago } = await orderService.createOrder(req.body, usuarioId, usuario);

    adminClients.forEach(client => {
      client.write(`data: ${JSON.stringify(pedido)}\n\n`);
    });

    res.status(201).json({
      message: pago.estado === 'Aprobado' ? 'Pago aprobado y pedido creado' : 'Pedido creado, pendiente de pago',
      pedido,
      pago: { estado: pago.estado, transaccionId: pago.transaccionId, detalle: pago.detalle },
    });
  } catch (error) {
    if (error instanceof PaymentError || error instanceof OrderError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el pedido' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const pedidos = await orderService.getOrdersByUser(usuarioId);
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const pedidos = await orderService.getAllOrders();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await orderService.updateOrderStatus(Number(id), estado);

    res.json(pedido);
  } catch (error) {
    if (error instanceof OrderError) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
};
