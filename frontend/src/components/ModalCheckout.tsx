import { useState, useContext, useEffect } from 'react';
import api from '../configuracionAPI';
import { AuthContext } from '../context/ContextoAutenticacion';
import { CartContext } from '../context/ContextoCarrito';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { user } = useContext(AuthContext);
  const { cart, total, clearCart } = useContext(CartContext);
  
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta de Crédito');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setDireccion('');
      setMetodoPago('Tarjeta de Crédito');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para finalizar la compra.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/orders', {
        nombreCliente: user.nombre,
        emailCliente: user.email,
        direccion,
        metodoPago,
        detallesPago: 'Pendiente de procesamiento',
        cartItems: cart,
        total
      });
      
      clearCart();
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al procesar la compra.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="modal-overlay active">
        <div className="modal-container glass-card" style={{ maxWidth: '400px', textAlign: 'center', padding: '40px 20px' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: 'var(--primary-pink)', marginBottom: '20px' }}></i>
          <h2 style={{ color: 'var(--dark-rose)', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>¡Compra exitosa!</h2>
          <p style={{ color: 'var(--medium-rose)', marginBottom: '25px', fontSize: '1.1rem' }}>Ha realizado con éxito su compra, gracias.</p>
          <button className="btn btn-pink btn-block" onClick={() => { setIsSuccess(false); onClose(); }}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay active">
      <div className="modal-container glass-card" style={{ maxWidth: '500px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 style={{ marginBottom: '20px', color: 'var(--primary-pink)' }}>Finalizar Compra</h2>
        
        <form onSubmit={handleSubmit} className="auth-form active">
          <div className="form-group">
            <label>Dirección de Envío</label>
            <input 
              type="text" 
              className="form-control" 
              value={direccion} 
              onChange={e => setDireccion(e.target.value)} 
              required 
              placeholder="Calle Falsa 123, Ciudad"
            />
          </div>
          
          <div className="form-group">
            <label>Método de Pago</label>
            <select 
              className="form-control" 
              value={metodoPago} 
              onChange={e => setMetodoPago(e.target.value)}
            >
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Tarjeta de Débito">Tarjeta de Débito</option>
              <option value="Mercado Pago">Mercado Pago</option>
              <option value="Efectivo en una Tómbola">Efectivo en una Tómbola</option>
            </select>
          </div>

          <div style={{ margin: '20px 0', padding: '15px', backgroundColor: 'rgba(255,182,193,0.2)', borderRadius: '8px' }}>
            <h4 style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
              <span>Total a pagar:</span>
              <span>${total.toLocaleString()}</span>
            </h4>
          </div>

          {error && <div className="text-danger" style={{ marginBottom: '15px' }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-pink btn-block btn-lg" 
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
