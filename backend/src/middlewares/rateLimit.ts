import { Request, Response, NextFunction } from 'express';

/**
 * Limitador simple en memoria (suficiente para un TP / una sola instancia).
 * Corta fuerza bruta sobre login y registro.
 */
export const rateLimit = (maxAttempts: number, windowMs: number) => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.ip}:${String(req.body?.email || '').toLowerCase()}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > maxAttempts) {
      const retry = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retry));
      return res
        .status(429)
        .json({ error: `Demasiados intentos. Probá de nuevo en ${Math.ceil(retry / 60)} min.` });
    }
    next();
  };
};
