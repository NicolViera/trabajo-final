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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginTab) {
        const { data } = await api.post('/users/login', { email, contrasena });
        login(data.user, data.token);
        onClose();
      } else {
        await api.post('/users/register', { nombre, email, contrasena });
        // After register, you might auto-login or ask to login
        alert('Cuenta creada. Por favor, inicia sesión.');
        setIsLoginTab(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de autenticación');
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container auth-modal-container glass-card">
        <button className="modal-close-btn" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        <div className="auth-tabs">
          <button className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`} onClick={() => setIsLoginTab(true)}>Iniciar Sesión</button>
          <button className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`} onClick={() => setIsLoginTab(false)}>Registrarse</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form active">
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
            <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} className="form-control" required />
          </div>

          {error && <div className="text-danger">{error}</div>}

          <button type="submit" className="btn btn-pink btn-block btn-lg" style={{ marginTop: '15px' }}>
            {isLoginTab ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
