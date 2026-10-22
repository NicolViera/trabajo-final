import { useState, useContext } from 'react';
import { AuthContext } from '../context/ContextoAutenticacion';
import api from '../configuracionAPI';

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { login } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = (): string | null => {
    if (!isLoginTab && nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return 'Ingresá un correo electrónico válido';
    if (isLoginTab) return contrasena ? null : 'Ingresá tu contraseña';
    if (contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Za-z]/.test(contrasena) || !/\d/.test(contrasena)) return 'La contraseña debe incluir al menos una letra y un número';
    return null;
  };

  const switchTab = (login: boolean) => {
    setIsLoginTab(login);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isLoginTab) {
        const { data } = await api.post('/users/login', { email: email.trim(), contrasena });
        login(data.user, data.token);
      } else {
        // El backend devuelve el token al registrar: se inicia sesión directamente
        const { data } = await api.post('/users/register', { nombre: nombre.trim(), email: email.trim(), contrasena });
        login(data.user, data.token);
      }
      setContrasena('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container auth-modal-container glass-card">
        <button className="modal-close-btn" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        <div className="auth-tabs">
          <button className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`} type="button" onClick={() => switchTab(true)}>Iniciar Sesión</button>
          <button className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`} type="button" onClick={() => switchTab(false)}>Registrarse</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form active" noValidate>
          {!isLoginTab && (
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="form-control" required />
            </div>
          )}
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} className="form-control" required autoComplete={isLoginTab ? 'current-password' : 'new-password'} />
            {!isLoginTab && <small style={{ opacity: 0.7 }}>Mínimo 8 caracteres, con letras y números.</small>}
          </div>

          {error && <div className="text-danger">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-pink btn-block btn-lg" style={{ marginTop: '15px' }}>
            {loading ? 'Procesando...' : isLoginTab ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
