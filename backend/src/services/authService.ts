import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth';

const prisma = new PrismaClient();

// Hash falso para que el tiempo de respuesta no revele si el email existe.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-1', 10);

export const authService = {
  registerUser: async (nombre: string, email: string, contrasena: string) => {
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    try {
      const usuario = await prisma.usuario.create({
        data: { nombre: nombre.trim(), email, contrasena: hashedPassword, rol: 'cliente' },
      });
      const token = generateToken(usuario.id, usuario.rol);
      return { usuario, token };
    } catch (e) {
      // Dos registros simultáneos con el mismo email
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new Error('El correo electrónico ya está en uso');
      }
      throw e;
    }
  },

  loginUser: async (email: string, contrasena: string) => {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    const isPasswordValid = await bcrypt.compare(contrasena, usuario?.contrasena ?? DUMMY_HASH);
    if (!usuario || !isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = generateToken(usuario.id, usuario.rol);
    return { usuario, token };
  },
};
