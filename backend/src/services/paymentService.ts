import crypto from 'crypto';
import { luhnCheck } from '../utils/validators';

/**
 * Pasarela de pagos SIMULADA (modo sandbox).
 *
 * Hace lo mismo que haría una pasarela real a nivel de flujo:
 *  - valida los datos de la tarjeta (Luhn, vencimiento, CVV),
 *  - aprueba o rechaza,
 *  - devuelve un ID de transacción,
 *  - y NUNCA guarda el número completo ni el CVV (solo marca y últimos 4).
 *
 * Para pasar a Mercado Pago / Stripe real solo hay que reemplazar el
 * cuerpo de `chargeCard` por la llamada al SDK; el resto del sistema no cambia.
 *
 * Tarjetas de prueba:
 *   4242 4242 4242 4242  -> aprobada (Visa)
 *   5555 5555 5555 4444  -> aprobada (Mastercard)
 *   4000 0000 0000 0002  -> rechazada: fondos insuficientes
 *   4000 0000 0000 0069  -> rechazada: tarjeta vencida
 *   4000 0000 0000 0127  -> rechazada: CVV incorrecto
 */

export const PAYMENT_METHODS = [
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Transferencia Bancaria',
  'Efectivo',
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export class PaymentError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
  }
}

export interface CardData {
  numero?: unknown;
  titular?: unknown;
  vencimiento?: unknown; // MM/AA
  cvv?: unknown;
}

export interface PaymentResult {
  estado: 'Aprobado' | 'Pendiente';
  transaccionId: string;
  detalle: string; // texto seguro para guardar en la BD
}

const DECLINED: Record<string, string> = {
  '4000000000000002': 'Pago rechazado: fondos insuficientes',
  '4000000000000069': 'Pago rechazado: tarjeta vencida',
  '4000000000000127': 'Pago rechazado: código de seguridad incorrecto',
};

const brandOf = (n: string) => (/^4/.test(n) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : 'Tarjeta');

const txId = () => `TX-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

/** Valida el formato de la tarjeta; lanza PaymentError (400) si algo está mal. */
export const validateCard = (card: CardData) => {
  const numero = String(card?.numero ?? '').replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(numero) || !luhnCheck(numero)) {
    throw new PaymentError('El número de tarjeta no es válido');
  }

  const titular = String(card?.titular ?? '').trim();
  if (titular.length < 3) throw new PaymentError('Ingresá el nombre del titular tal como figura en la tarjeta');

  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(card?.vencimiento ?? '').trim());
  if (!m) throw new PaymentError('El vencimiento debe tener formato MM/AA');
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) throw new PaymentError('El mes de vencimiento no es válido');
  const now = new Date();
  // La tarjeta vale hasta el último día del mes de vencimiento
  if (anio < now.getFullYear() || (anio === now.getFullYear() && mes < now.getMonth() + 1)) {
    throw new PaymentError('La tarjeta está vencida');
  }

  if (!/^\d{3,4}$/.test(String(card?.cvv ?? ''))) {
    throw new PaymentError('El código de seguridad (CVV) debe tener 3 o 4 dígitos');
  }

  return { numero, titular };
};

const chargeCard = (monto: number, card: CardData, metodo: PaymentMethod): PaymentResult => {
  const { numero } = validateCard(card);

  const motivo = DECLINED[numero];
  if (motivo) throw new PaymentError(motivo, 402);

  return {
    estado: 'Aprobado',
    transaccionId: txId(),
    detalle: `Aprobado · ${metodo} ${brandOf(numero)} **** ${numero.slice(-4)} · $${monto.toFixed(2)}`,
  };
};

export const paymentService = {
  /** Procesa el pago según el método elegido. Lanza PaymentError si no se puede cobrar. */
  process: (metodo: unknown, monto: number, card?: CardData): PaymentResult => {
    if (!PAYMENT_METHODS.includes(metodo as PaymentMethod)) {
      throw new PaymentError('Método de pago no válido');
    }
    if (!(monto > 0)) throw new PaymentError('El monto a pagar no es válido');

    switch (metodo as PaymentMethod) {
      case 'Tarjeta de Crédito':
      case 'Tarjeta de Débito':
        return chargeCard(monto, card ?? {}, metodo as PaymentMethod);

      case 'Transferencia Bancaria': {
        const id = txId();
        return {
          estado: 'Pendiente',
          transaccionId: id,
          detalle: `Pendiente de transferencia · Ref. ${id} · Alias: CHIC.ROSE.TIENDA · $${monto.toFixed(2)}`,
        };
      }

      case 'Efectivo':
        return {
          estado: 'Pendiente',
          transaccionId: txId(),
          detalle: `Pendiente: se abona en efectivo al retirar en el local · $${monto.toFixed(2)}`,
        };
    }
  },
};
