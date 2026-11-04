# Cambios: login, validación y pasarela de pagos

Solo se tocaron los archivos listados abajo (copiar sobre el proyecto respetando las rutas).

## Login / validación
- `backend/src/server.ts`: `import 'dotenv/config'` primero. Antes el JWT usaba SIEMPRE "fallback_secret" porque .env se cargaba después de leer la clave.
- `backend/src/utils/auth.ts`: sin clave por defecto en producción.
- `backend/src/utils/validators.ts` (nuevo): nombre, email (normaliza a minúsculas), contraseña (8+ con letra y número), Luhn.
- `backend/src/middlewares/rateLimit.ts` (nuevo) + `routes/authRoutes.ts`: máx. 10 intentos / 15 min en login y registro.
- `controllers/authController.ts`, `services/authService.ts`: validaciones, email duplicado en carrera, mismo tiempo de respuesta si el email no existe.
- `controllers/orderController.ts`: `/api/orders/stream` (SSE) ahora exige token de admin; antes cualquiera veía los pedidos.
- Frontend: `ModalLogin.tsx` valida antes de enviar y entra directo al registrarse; `configuracionAPI.ts` + `ContextoAutenticacion.tsx` cierran sesión si el token venció; `PanelAdmin.tsx` manda el token al stream.

## Pasarela de pagos (simulada, modo sandbox)
- `backend/src/services/paymentService.ts` (nuevo): valida tarjeta (Luhn, vencimiento, CVV, titular), aprueba/rechaza, devuelve ID de transacción. No guarda número completo ni CVV.
- `backend/src/services/orderService.ts`: precios y total se calculan en el servidor; descuenta stock sin permitir negativos; si el pago se rechaza se revierte todo (transacción). Estado "Preparando" (pago aprobado) o "Pendiente de pago" (transferencia / efectivo).
- Métodos según el enunciado: Tarjeta de Crédito, Tarjeta de Débito, Transferencia Bancaria, Efectivo (solo con retiro). Entrega: envío o retiro en el local.
- `frontend/src/components/ModalCheckout.tsx`: formulario de tarjeta con validación y resultado real (aprobado / pendiente / rechazado).

Tarjetas de prueba: 4242 4242 4242 4242 (aprueba) · 4000 0000 0000 0002 (fondos insuficientes) · 4000 0000 0000 0069 (vencida) · 4000 0000 0000 0127 (CVV).

## Para correr
    cd backend && cp .env.example .env   # poné un JWT_SECRET propio
    npx prisma generate && npx prisma migrate deploy && npm run seed
    cd .. && npm run dev
No hay cambios en el schema de Prisma (no hace falta migración nueva).
