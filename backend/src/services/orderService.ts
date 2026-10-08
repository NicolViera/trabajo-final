import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const orderService = {
  createOrder: async (data: any, usuarioId?: number) => {
    const { nombreCliente, emailCliente, direccion, metodoPago, detallesPago, cartItems, total } = data;

    const numeroPedido = `ORD-${Date.now()}`;

    return await prisma.pedido.create({
      data: {
        numeroPedido,
        nombreCliente,
        emailCliente,
        direccion,
        total: Number(total),
        metodoPago,
        detallesPago,
        usuarioId,
        detalles: {
          create: cartItems.map((item: any) => ({
            productoId: item.id,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
        },
      },
      include: { detalles: true },
    });
  },

  getOrdersByUser: async (userId: number) => {
    return await prisma.pedido.findMany({
      where: { usuarioId: userId },
      include: {
        detalles: {
          include: { producto: true },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  getAllOrders: async () => {
    return await prisma.pedido.findMany({
      include: {
        usuario: true,
        detalles: {
          include: { producto: true },
        },
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  updateOrderStatus: async (id: number, estado: string) => {
    return await prisma.pedido.update({
      where: { id },
      data: { estado },
    });
  }
};
