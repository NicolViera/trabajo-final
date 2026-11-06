// Umbral de stock bajo (regla de negocio 16: al llegar al mínimo se genera una alerta de reposición).
// Se puede cambiar con LOW_STOCK_THRESHOLD en el archivo .env (por defecto 5).
const raw = process.env.LOW_STOCK_THRESHOLD;
const parsed = raw ? Number(raw) : NaN;

export const LOW_STOCK_THRESHOLD = Number.isInteger(parsed) && parsed >= 0 ? parsed : 5;
