import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { normalizeEmail, validateEmail, validateName, validatePassword } from '../utils/validators';

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, contrasena } = req.body ?? {};
    const email = normalizeEmail(req.body?.email);

    const validationError = validateName(nombre) || validateEmail(email) || validatePassword(contrasena);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { usuario, token } = await authService.registerUser(nombre, email, contrasena);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      token,
    });
  } catch (error: any) {
    if (error.message === 'El correo electrónico ya está en uso') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { contrasena } = req.body ?? {};
    const email = normalizeEmail(req.body?.email);

    if (!email || typeof contrasena !== 'string' || !contrasena) {
      return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios' });
    }

    const { usuario, token } = await authService.loginUser(email, contrasena);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      token,
    });
  } catch (error: any) {
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
