import { PrismaClient } from '@prisma/client';
import { paymentService, PaymentError, PAYMENT_METHODS } from './paymentService';

const prisma = new PrismaClient();

export const ORDER_STATUSES = [
  'Pendiente de pago',
  'Preparando',
  'Enviado',
  'Listo para retirar',
  'Entregado',
  'Cancelado',
] as const;

export class OrderError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
  }
}

export const orderService = {
  /**
   * Crea un pedido de forma segura:
   *  1. valida el carrito contra la BD (el precio y el total NO se toman del cliente),
   *  2. descuenta stock sin permitir negativos (regla de negocio 15),
   *  3. procesa el pago,
   *  4. guarda pedido + detalle. Todo en una transacción: si el pago se rechaza, se revierte.
   */
  createOrder: async (data: any, usuarioId: number, usuario: { nombre: string; email: string }) => {
    const { entrega, direccion, metodoPago, tarjeta, cartItems } = data ?? {};

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new OrderError('El carrito está vacío');
    }
    if (!PAYMENT_METHODS.includes(metodoPago)) throw new OrderError('Método de pago no válido');

    const esRetiro = entrega === 'retiro';
    if (entrega !== 'retiro' && entrega !== 'envio') throw new OrderError('Elegí envío o retiro en el local');
    if (metodoPago === 'Efectivo' && !esRetiro) {
      throw new OrderError('El pago en efectivo solo está disponible con retiro en el local');
    }
    const dir = String(direccion ?? '').trim();
    if (!esRetiro && dir.length < 5) throw new OrderError('Ingresá una dirección de envío válida');

    // Unificar ítems repetidos y validar cantidades
    const qtyById = new Map<number, number>();
    for (const item of cartItems) {
      const id = Number(item?.id);
      const cantidad = Number(item?.cantidad);
      if (!Number.isInteger(id) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
        throw new OrderError('El carrito contiene datos inválidos');
      }
      qtyById.set(id, (qtyById.get(id) ?? 0) + cantidad);
    }

    return await prisma.$transaction(async (tx) => {
      const productos = await tx.producto.findMany({ where: { id: { in: [...qtyById.keys()] } } });
      if (productos.length !== qtyById.size) throw new OrderError('Algún producto del carrito ya no existe', 409);

      let total = 0;
      const detalles = [];
      for (const p of productos) {
        const cantidad = qtyById.get(p.id)!;
        // updateMany condicional = descuento atómico; si no alcanza, count = 0
        const upd = await tx.producto.updateMany({
          where: { id: p.id, stock: { gte: cantidad } },
          data: { stock: { decrement: cantidad } },
        });
        if (upd.count === 0) {
          throw new OrderError(`Stock insuficiente para "${p.titulo}" (disponible: ${p.stock})`, 409);
        }
        total += p.precio * cantidad;
        detalles.push({ productoId: p.id, cantidad, precio: p.precio });
      }
      total = Math.round(total * 100) / 100;

      // Si el pago es rechazado lanza PaymentError y la transacción se revierte (stock incluido)
      const pago = paymentService.process(metodoPago, total, tarjeta);

      const pedido = await tx.pedido.create({
        data: {
          numeroPedido: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          nombreCliente: usuario.nombre,
          emailCliente: usuario.email,
          direccion: esRetiro ? 'Retiro en el local (Mitre 41, Concordia)' : dir,
          total,
          metodoPago,
          detallesPago: pago.detalle,
          estado: pago.estado === 'Aprobado' ? 'Preparando' : 'Pendiente de pago',
          usuarioId,
          detalles: { create: detalles },
        },
        include: { detalles: true },
      });

      return { pedido, pago };
    });
  },

  getOrdersByUser: async (userId: number) => {
    return await prisma.pedido.findMany({
      where: { usuarioId: userId },
      include: { detalles: { include: { producto: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  getAllOrders: async () => {
    return await prisma.pedido.findMany({
      include: { usuario: { select: { id: true, nombre: true, email: true } }, detalles: { include: { producto: true } } },
      orderBy: { creadoEn: 'desc' },
    });
  },

  updateOrderStatus: async (id: number, estado: string) => {
    if (!ORDER_STATUSES.includes(estado as any)) throw new OrderError('Estado de pedido no válido');
    return await prisma.pedido.update({ where: { id }, data: { estado } });
  },
};

export { PaymentError };
