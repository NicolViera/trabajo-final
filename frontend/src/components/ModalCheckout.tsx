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
  
  const [entrega, setEntrega] = useState<'envio' | 'retiro'>('envio');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta de Crédito');
  const [numero, setNumero] = useState('');
  const [titular, setTitular] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultado, setResultado] = useState<{ estado: string; transaccionId: string; numeroPedido: string } | null>(null);

  const esTarjeta = metodoPago === 'Tarjeta de Crédito' || metodoPago === 'Tarjeta de Débito';

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setResultado(null);
      setEntrega('envio');
      setDireccion('');
      setMetodoPago('Tarjeta de Crédito');
      setNumero('');
      setTitular('');
      setVencimiento('');
      setCvv('');
      setError('');
    }
  }, [isOpen]);

  const cambiarEntrega = (v: 'envio' | 'retiro') => {
    setEntrega(v);
    // Efectivo solo se acepta al retirar en el local
    if (v === 'envio' && metodoPago === 'Efectivo') setMetodoPago('Tarjeta de Crédito');
  };

  const formatNumero = (v: string) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
  const formatVenc = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const luhn = (digits: string) => {
    let sum = 0;
    let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = Number(digits[i]);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  };

  const validar = (): string | null => {
    if (cart.length === 0) return 'El carrito está vacío.';
    if (entrega === 'envio' && direccion.trim().length < 5) return 'Ingresá una dirección de envío válida.';
    if (!esTarjeta) return null;
    const num = numero.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(num) || !luhn(num)) return 'El número de tarjeta no es válido.';
    if (titular.trim().length < 3) return 'Ingresá el nombre del titular.';
    const m = /^(\d{2})\/(\d{2})$/.exec(vencimiento);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return 'El vencimiento debe tener formato MM/AA.';
    const hoy = new Date();
    const anio = 2000 + Number(m[2]);
    if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && Number(m[1]) < hoy.getMonth() + 1)) return 'La tarjeta está vencida.';
    if (!/^\d{3,4}$/.test(cvv)) return 'El CVV debe tener 3 o 4 dígitos.';
    return null;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para finalizar la compra.');
      return;
    }

    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // El servidor recalcula precios y total desde la base de datos; acá solo se envía qué y cuánto.
      const { data } = await api.post('/orders', {
        entrega,
        direccion: entrega === 'envio' ? direccion.trim() : '',
        metodoPago,
        tarjeta: esTarjeta ? { numero: numero.replace(/\s/g, ''), titular: titular.trim(), vencimiento, cvv } : undefined,
        cartItems: cart.map((i) => ({ id: i.id, cantidad: i.cantidad })),
      });

      setResultado({ estado: data.pago.estado, transaccionId: data.pago.transaccionId, numeroPedido: data.pedido.numeroPedido });
      setCvv('');
      setNumero('');
      clearCart();
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo conectar con el servidor.');
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
          <h2 style={{ color: 'var(--dark-rose)', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>
            {resultado?.estado === 'Aprobado' ? '¡Pago aprobado!' : '¡Pedido registrado!'}
          </h2>
          <p style={{ color: 'var(--medium-rose)', marginBottom: '10px', fontSize: '1.1rem' }}>
            {resultado?.estado === 'Aprobado'
              ? 'Tu pago fue aprobado y estamos preparando tu pedido.'
              : metodoPago === 'Efectivo'
                ? 'Abonás en efectivo cuando lo retires en el local.'
                : 'Tu pedido queda pendiente hasta que se acredite la transferencia.'}
          </p>
          {resultado && (
            <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>
              Pedido <strong>{resultado.numeroPedido}</strong><br />Operación {resultado.transaccionId}
            </p>
          )}
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
        
        <form onSubmit={handleSubmit} className="auth-form active" noValidate>
          <div className="form-group">
            <label>Entrega</label>
            <select className="form-control" value={entrega} onChange={e => cambiarEntrega(e.target.value as 'envio' | 'retiro')}>
              <option value="envio">Envío a domicilio</option>
              <option value="retiro">Retiro en el local (Mitre 41, Concordia)</option>
            </select>
          </div>

          {entrega === 'envio' && (
            <div className="form-group">
              <label>Dirección de Envío</label>
              <input
                type="text"
                className="form-control"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                placeholder="Calle y número, ciudad"
              />
            </div>
          )}

          <div className="form-group">
            <label>Método de Pago</label>
            <select className="form-control" value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="Tarjeta de Débito">Tarjeta de Débito</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              {entrega === 'retiro' && <option value="Efectivo">Efectivo (al retirar)</option>}
            </select>
          </div>

          {esTarjeta && (
            <>
              <div className="form-group">
                <label>Número de tarjeta</label>
                <input type="text" inputMode="numeric" autoComplete="cc-number" className="form-control"
                  value={numero} onChange={e => setNumero(formatNumero(e.target.value))} placeholder="4242 4242 4242 4242" />
              </div>
              <div className="form-group">
                <label>Titular</label>
                <input type="text" autoComplete="cc-name" className="form-control"
                  value={titular} onChange={e => setTitular(e.target.value)} placeholder="Como figura en la tarjeta" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Vencimiento</label>
                  <input type="text" inputMode="numeric" autoComplete="cc-exp" className="form-control"
                    value={vencimiento} onChange={e => setVencimiento(formatVenc(e.target.value))} placeholder="MM/AA" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>CVV</label>
                  <input type="password" inputMode="numeric" autoComplete="cc-csc" className="form-control"
                    value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" />
                </div>
              </div>
              <small style={{ opacity: 0.7 }}>Modo prueba: 4242 4242 4242 4242 aprueba · 4000 0000 0000 0002 rechaza.</small>
            </>
          )}

          {metodoPago === 'Transferencia Bancaria' && (
            <p style={{ fontSize: '0.9rem' }}>Al confirmar te damos una referencia para transferir al alias <strong>CHIC.ROSE.TIENDA</strong>. El pedido se prepara cuando se acredita el pago.</p>
          )}
          {metodoPago === 'Efectivo' && (
            <p style={{ fontSize: '0.9rem' }}>Reservamos tu pedido y lo abonás en efectivo al retirarlo en el local.</p>
          )}

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
            {loading ? 'Procesando pago...' : esTarjeta ? 'Pagar' : 'Confirmar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
