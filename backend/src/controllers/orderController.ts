import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { AuthRequest } from '../middlewares/authMiddleware';

let adminClients: Response[] = [];

export const streamOrders = (req: Request, res: Response) => {
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
    const pedido = await orderService.createOrder(req.body, usuarioId);

    adminClients.forEach(client => {
      client.write(`data: ${JSON.stringify(pedido)}\n\n`);
    });

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido,
    });
  } catch (error) {
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
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
};
