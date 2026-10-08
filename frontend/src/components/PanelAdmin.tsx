import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../configuracionAPI';

interface Producto {
  id: number;
  sku: string;
  titulo: string;
  precio: number;
  stock: number;
  descripcion: string;
  urlImagen: string;
  categoria: { nombre: string };
  categoriaId?: number;
}

interface AdminPanelProps {
  products: Producto[];
  setProducts: React.Dispatch<React.SetStateAction<Producto[]>>;
}

// Mock sales data
const generateSalesData = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  return days.map((day) => ({
    day,
    ventas: Math.floor(Math.random() * 80000) + 20000,
    pedidos: Math.floor(Math.random() * 15) + 3,
    tendencia: Math.floor(Math.random() * 60000) + 30000,
  }));
};

const monthlyData = [
  { mes: 'Ene', ventas: 120000 },
  { mes: 'Feb', ventas: 98000 },
  { mes: 'Mar', ventas: 145000 },
  { mes: 'Abr', ventas: 162000 },
  { mes: 'May', ventas: 178000 },
  { mes: 'Jun', ventas: 210000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.95)', border: '1px solid #fbb1bd', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 4px 15px rgba(255,117,151,0.15)'
      }}>
        <p style={{ fontWeight: 700, color: '#c62a47', marginBottom: '5px' }}>{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color, margin: '2px 0', fontSize: '0.85rem' }}>
            {entry.name}: {entry.name === 'ventas' || entry.name === 'tendencia' ? `$${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminPanel = ({ products, setProducts }: AdminPanelProps) => {
  const [dailyData] = useState(generateSalesData);

  useEffect(() => {
    const source = new EventSource('http://localhost:3001/api/orders/stream');

    source.onmessage = (event) => {
      try {
        const newOrder = JSON.parse(event.data);
        alert(`¡NUEVA VENTA REGISTRADA!\n\nCliente: ${newOrder.nombreCliente}\nMétodo: ${newOrder.metodoPago}\nTotal: $${newOrder.total.toLocaleString()}`);
      } catch (err) {
        console.error('Error parsing SSE event data:', err);
      }
    };

    return () => {
      source.close();
    };
  }, []);
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory'>('stats');
  
  // Product Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    sku: '', titulo: '', precio: '', stock: '', urlImagen: '', descripcion: '', nombreCategoria: ''
  });

  const totalRevenue = monthlyData.reduce((acc, m) => acc + m.ventas, 0);
  const totalOrders = dailyData.reduce((acc, d) => acc + d.pedidos, 0);
  const firstHalf = monthlyData.slice(0, 3).reduce((a, m) => a + m.ventas, 0);
  const secondHalf = monthlyData.slice(3).reduce((a, m) => a + m.ventas, 0);
  const trendUp = secondHalf > firstHalf;

  // Logging Helper
  const logAction = (action: 'CREATE' | 'UPDATE' | 'DELETE', details: string) => {
    const log = { id: Date.now().toString(), timestamp: new Date().toISOString(), action, details };
    const saved = localStorage.getItem('admin_activity_log');
    const history = saved ? JSON.parse(saved) : [];
    localStorage.setItem('admin_activity_log', JSON.stringify([log, ...history]));
  };

  const handleOpenModal = (product?: Producto) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        sku: product.sku, titulo: product.titulo, precio: product.precio.toString(), stock: product.stock.toString(), 
        urlImagen: product.urlImagen, descripcion: product.descripcion, nombreCategoria: product.categoria?.nombre || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ sku: '', titulo: '', precio: '', stock: '', urlImagen: '', descripcion: '', nombreCategoria: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { data } = await api.put(`/products/${editingProduct.id}`, formData);
        setProducts(prev => prev.map(p => p.id === data.id ? data : p));
        logAction('UPDATE', `Producto modificado: ${data.titulo}`);
        alert('Producto actualizado exitosamente');
      } else {
        const { data } = await api.post('/products', formData);
        setProducts(prev => [...prev, data]);
        logAction('CREATE', `Nuevo producto agregado: ${data.titulo}`);
        alert('Producto creado exitosamente');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (id: number, title: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${title}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      logAction('DELETE', `Producto eliminado: ${title}`);
      alert('Producto eliminado');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar producto');
    }
  };

  return (
    <section id="admin-view" className="view-section">
      <div className="admin-header">
        <div>
          <h2>Panel de Control Administrativo</h2>
          <p className="admin-subtitle">Monitorea tus ventas, pedidos y gestiona el inventario de la tienda.</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <i className="fa-solid fa-chart-simple"></i> Estadísticas de Ventas
        </button>
        <button className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          <i className="fa-solid fa-boxes-stacked"></i> Inventario de Productos
        </button>
      </div>

      {activeTab === 'stats' && (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon icon-rose"><i className="fa-solid fa-sack-dollar"></i></div>
              <div className="kpi-info"><span className="kpi-label">Ingresos Totales (6m)</span><h3 className="kpi-value">${totalRevenue.toLocaleString()}</h3></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon icon-blue"><i className="fa-solid fa-cart-shopping"></i></div>
              <div className="kpi-info"><span className="kpi-label">Pedidos Esta Semana</span><h3 className="kpi-value">{totalOrders}</h3></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon icon-purple"><i className="fa-solid fa-boxes-stacked"></i></div>
              <div className="kpi-info"><span className="kpi-label">Productos en Catálogo</span><h3 className="kpi-value">{products.length}</h3></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: trendUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)' }}>
                <i className={`fa-solid fa-arrow-trend-${trendUp ? 'up' : 'down'}`} style={{ color: trendUp ? '#22c55e' : '#ef4444' }}></i>
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Tendencia General</span>
                <h3 className="kpi-value" style={{ color: trendUp ? '#22c55e' : '#ef4444' }}>{trendUp ? '▲ En Alza' : '▼ En Baja'}</h3>
              </div>
            </div>
          </div>

          <div className="dashboard-row">
            <div className="dashboard-card main-chart-card">
              <div className="card-header">
                <h3>Ventas Diarias de la Semana</h3><span className="card-timeframe">Últimos 7 días</span>
              </div>
              <div style={{ width: '100%', height: 260, marginTop: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff7597" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#ff7597" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffe5ec" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#c62a47' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#c62a47' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="ventas" name="ventas" stroke="#ff7597" strokeWidth={2.5} fill="url(#colorVentas)" dot={{ r: 4, fill: '#ff7597', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6, fill: '#ff7597' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-card popular-products-card">
              <div className="card-header">
                <h3>Evolución Mensual</h3>
              </div>
              <div style={{ width: '100%', height: 260, marginTop: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffe5ec" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#c62a47' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#c62a47' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ventas" name="ventas" fill="#ff7597" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'inventory' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
            <button className="btn btn-pink" onClick={() => handleOpenModal()}>
              <i className="fa-solid fa-plus"></i> Añadir Producto
            </button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.urlImagen} alt={p.titulo} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #fbb1bd' }} /></td>
                    <td style={{ fontWeight: 600, color: '#3d262a' }}>{p.titulo}</td>
                    <td><span style={{ background: '#fff0f3', color: '#c62a47', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{p.categoria?.nombre || 'N/A'}</span></td>
                    <td>
                      <span style={{ color: p.stock <= 5 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{p.stock}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#ff7597', fontSize: '1.05rem' }}>${p.precio.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-outline-pink btn-sm" style={{ marginRight: '8px' }} onClick={() => handleOpenModal(p)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn btn-outline-pink btn-sm" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDeleteProduct(p.id, p.titulo)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-container auth-modal-container glass-card">
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--dark-rose)', marginBottom: '20px' }}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <form onSubmit={handleSaveProduct} className="auth-form active">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Título</label>
                  <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <input type="text" value={formData.nombreCategoria} onChange={e => setFormData({...formData, nombreCategoria: e.target.value})} className="form-control" placeholder="Ej: Vestidos" required />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input type="number" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>URL Imagen</label>
                  <input type="text" value={formData.urlImagen} onChange={e => setFormData({...formData, urlImagen: e.target.value})} className="form-control" required />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Descripción</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="form-control" rows={3} required></textarea>
              </div>
              <button type="submit" className="btn btn-pink btn-block btn-lg" style={{ marginTop: '20px' }}>Guardar Producto</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
