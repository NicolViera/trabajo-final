import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth';

const prisma = new PrismaClient();

export const authService = {
  registerUser: async (nombre: string, email: string, contrasena: string) => {
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        contrasena: hashedPassword,
        rol: 'cliente',
      },
    });

    const token = generateToken(usuario.id, usuario.rol);
    return { usuario, token };
  },

  loginUser: async (email: string, contrasena: string) => {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = generateToken(usuario.id, usuario.rol);
    return { usuario, token };
  }
};
