import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/ContextoAutenticacion';

interface ActionLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

interface Producto {
  id: number;
  titulo: string;
  stock: number;
}

interface ProfileViewProps {
  products: Producto[];
}

const ProfileView = ({ products }: ProfileViewProps) => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState<ActionLog[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('admin_activity_log');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <section id="profile-view" className="view-section">
      <div className="admin-header">
        <div>
          <h2>Mi Cuenta - {user?.nombre}</h2>
          <p className="admin-subtitle">
            {user?.rol === 'admin' ? 'Panel de alertas e historial de actividad' : 'Gestiona tus datos personales y pedidos.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        
        {/* Historial Panel (Left) */}
        {user?.rol === 'admin' ? (
          <div className="dashboard-card" style={{ background: 'white', borderRadius: '15px', padding: '25px', border: '1px solid var(--pastel-blush)', boxShadow: 'var(--glass-shadow)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--dark-rose)', marginBottom: '20px', borderBottom: '2px solid var(--primary-pink)', paddingBottom: '10px' }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--primary-pink)', marginRight: '10px' }}></i>
              Historial de Acciones
            </h3>
            
            {history.length === 0 ? (
              <p style={{ color: 'var(--medium-rose)' }}>No hay acciones recientes registradas.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto' }}>
                {history.map(log => (
                  <div key={log.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', paddingBottom: '15px', borderBottom: '1px dashed #ffe5ec' }}>
                    <div style={{ background: 'var(--light-pink)', color: 'var(--primary-pink)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={log.action === 'CREATE' ? 'fa-solid fa-plus' : log.action === 'UPDATE' ? 'fa-solid fa-pen' : 'fa-solid fa-trash'}></i>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: 'var(--dark-rose)' }}>{log.details}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--medium-rose)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="dashboard-card" style={{ background: 'white', borderRadius: '15px', padding: '25px', border: '1px solid var(--pastel-blush)', boxShadow: 'var(--glass-shadow)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--dark-rose)', marginBottom: '20px' }}>Mis Pedidos</h3>
            <p style={{ color: 'var(--medium-rose)' }}>Aún no has realizado ninguna compra.</p>
          </div>
        )}

        {/* Alerts Panel (Right) - Only for Admin */}
        {user?.rol === 'admin' && (
          <div className="dashboard-card" style={{ background: 'white', borderRadius: '15px', padding: '25px', border: '1px solid var(--pastel-blush)', boxShadow: 'var(--glass-shadow)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#ef4444', marginBottom: '20px', borderBottom: '2px solid #ef4444', paddingBottom: '10px' }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '10px' }}></i>
              Alertas de Stock
            </h3>
            
            {lowStockProducts.length === 0 ? (
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-check-circle"></i>
                <span>Inventario saludable. Todos los productos tienen buen stock.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {lowStockProducts.map(p => (
                  <div key={p.id} style={{ background: p.stock === 0 ? '#fef2f2' : '#fff7ed', border: `1px solid ${p.stock === 0 ? '#fecaca' : '#fed7aa'}`, padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: p.stock === 0 ? '#dc2626' : '#c2410c' }}>{p.titulo}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>ID: {p.id}</span>
                    </div>
                    <div style={{ background: p.stock === 0 ? '#dc2626' : '#ea580c', color: 'white', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {p.stock === 0 ? 'Sin Stock' : `Quedan ${p.stock}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileView;
