import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET no está definido (obligatorio en producción)');
}
if (!secret) {
  console.warn('⚠️  JWT_SECRET no definido: usando clave de desarrollo. Copiá .env.example a .env');
}

const JWT_SECRET = secret || 'dev_only_secret_change_me';

export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
