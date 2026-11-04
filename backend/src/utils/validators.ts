// Validaciones compartidas del backend (login, registro, pagos).

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (email: unknown): string =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

/** Devuelve un mensaje de error, o null si el nombre es válido. */
export const validateName = (nombre: unknown): string | null => {
  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  if (nombre.trim().length > 80) return 'El nombre es demasiado largo';
  return null;
};

export const validateEmail = (email: unknown): string | null => {
  const e = normalizeEmail(email);
  if (!e) return 'El correo electrónico es obligatorio';
  if (e.length > 120 || !EMAIL_REGEX.test(e)) return 'El correo electrónico no es válido';
  return null;
};

export const validatePassword = (contrasena: unknown): string | null => {
  if (typeof contrasena !== 'string' || contrasena.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (contrasena.length > 72) return 'La contraseña es demasiado larga (máx. 72 caracteres)';
  if (!/[A-Za-z]/.test(contrasena) || !/\d/.test(contrasena)) {
    return 'La contraseña debe incluir al menos una letra y un número';
  }
  return null;
};

/** Algoritmo de Luhn para números de tarjeta. */
export const luhnCheck = (digits: string): boolean => {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};
