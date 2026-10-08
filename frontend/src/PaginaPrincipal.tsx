import { useEffect, useState, useContext } from 'react';
import { AuthContext } from './context/ContextoAutenticacion';
import { CartContext } from './context/ContextoCarrito';
import ModalLogin from './components/ModalLogin';
import ModalCheckout from './components/ModalCheckout';
import PanelAdmin from './components/PanelAdmin';
import VistaPerfil from './components/VistaPerfil';
import EstilistaVirtual from './individual_pro/EstilistaVirtual';
import api from './configuracionAPI';

interface Producto {
  id: number;
  sku: string;
  titulo: string;
  precio: number;
  stock: number;
  descripcion: string;
  urlImagen: string;
  categoria: { nombre: string };
}


const CATEGORIAS = ['Todos', 'Vestidos', 'Blusas', 'Abrigos', 'Polleras', 'Pantalones', 'Accesorios', 'Calzado'];

const LegacyFront = () => {
  const { user, logout } = useContext(AuthContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [view, setView] = useState('shop-view');

  const [products, setProducts] = useState<Producto[]>([]);
  const { cart, addToCart, removeFromCart, decreaseQuantity, total: cartTotal } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        // Mapear campos del server (inglés) → frontend (español)
        const mapped: Producto[] = data.map((p: any) => ({
          id: Number(p.id),
          sku: p.code || p.sku || '',
          titulo: p.title || p.titulo || '',
          precio: p.price ?? p.precio ?? 0,
          stock: p.stock ?? 0,
          descripcion: p.description || p.descripcion || '',
          urlImagen: p.image || p.urlImagen || '',
          categoria: { nombre: p.category || p.categoria?.nombre || 'Varios' },
        }));
        setProducts(mapped);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Producto) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const cartCount = cart.reduce((acc, item: any) => acc + item.cantidad, 0);

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoriaActiva === 'Todos' || p.categoria?.nombre === categoriaActiva;
    const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <header className="header">
        <div className="header-container">
          <a href="#" className="logo" onClick={() => setView('shop-view')}>
            <span className="logo-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></span>
            <span className="logo-text">Chic Rose</span>
          </a>

          <div className="search-bar">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Buscar vestidos, blusas, sacos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" id="search-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
          </div>

          <nav className="nav-links">
            <a href="#" className={`nav-item ${view === 'shop-view' ? 'active' : ''}`} onClick={() => setView('shop-view')}>Tienda</a>
            <a href="#" className={`nav-item ${view === 'stylist-view' ? 'active' : ''}`} onClick={() => setView('stylist-view')}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Estilista Virtual
            </a>
            {user?.rol === 'admin' && (
              <a href="#" className={`nav-item ${view === 'admin-view' ? 'active' : ''}`} onClick={() => setView('admin-view')}>
                <i className="fa-solid fa-chart-line"></i> Admin
              </a>
            )}
            {user && (
              <a href="#" className={`nav-item ${view === 'profile-view' ? 'active' : ''}`} onClick={() => setView('profile-view')}>
                <i className="fa-regular fa-user"></i> Mi Cuenta
              </a>
            )}
          </nav>

          <div className="header-controls">
            <div className="user-session-widget">
              {user ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--dark-rose)' }}>Hola, {user.nombre}</span>
                  <button className="btn btn-outline-pink btn-sm" onClick={logout}>Salir</button>
                </div>
              ) : (
                <button className="btn btn-outline-pink btn-sm" onClick={() => setIsAuthOpen(true)}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Iniciar Sesión
                </button>
              )}
            </div>
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <i className="fa-solid fa-bag-shopping"></i>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {view === 'shop-view' && (
          <section id="shop-view" className="view-section">
            <div className="promo-banner">
              <div className="promo-content">
                <span className="promo-tag">Nueva Colección Primavera - Verano</span>
                <h1 className="promo-title">Elegancia & Delicadeza en Tonos Rosas</h1>
                <p className="promo-text">Descubre prendas exclusivas diseñadas para realzar tu belleza natural con la máxima suavidad y estilo.</p>
                <button className="btn btn-pink">Explorar Colección</button>
              </div>
              <div className="promo-visual">
                <div className="visual-circle circle-1"></div>
                <div className="visual-circle circle-2"></div>
                <div className="floating-promo-card">
                  <span className="card-sale-badge">30% OFF</span>
                  <div className="promo-card-details">
                    <span className="promo-card-cat">Vestidos</span>
                    <h4>Gala Romantic Rose</h4>
                    <span className="promo-card-price">$15,500 <span className="old-price">$22,100</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Barra de categorías ── */}
            <div className="categories-bar">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  className={`cat-pill ${categoriaActiva === cat ? 'active' : ''}`}
                  onClick={() => setCategoriaActiva(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-container">
              <aside className="filters-sidebar">
                <div className="filter-promo-box">
                  <i className="fa-solid fa-gift pink-icon"></i>
                  <h4>Envío Gratis</h4>
                  <p>En compras superiores a $15,000 en todo el país.</p>
                </div>
              </aside>

              <div className="products-area">
                <div className="results-header">
                  <span className="results-count">
                    {categoriaActiva === 'Todos' ? 'Catálogo' : categoriaActiva}
                    {' '}— {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-card-img-wrapper" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                        <img className="product-card-img" src={product.urlImagen} alt={product.titulo} />
                        <button className="card-btn-fav" title="Favorito" onClick={e => e.stopPropagation()}>
                          <i className="fa-regular fa-heart"></i>
                        </button>
                      </div>
                      <div className="product-card-details" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                        <span className="product-card-cat">{product.categoria.nombre}</span>
                        <h3 className="product-card-title">{product.titulo}</h3>
                        <div className="product-card-price-row">
                          <span className="product-card-price">${product.precio.toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ padding: '0 16px 16px' }}>
                        <button className="product-card-btn-add" onClick={() => handleAddToCart(product)}>
                          <i className="fa-solid fa-bag-shopping"></i> Añadir a la Bolsa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'stylist-view' && <EstilistaVirtual products={products} addToCart={addToCart} setView={setView} />}
        {view === 'admin-view' && <PanelAdmin products={products} setProducts={setProducts} />}
        {view === 'profile-view' && <VistaPerfil products={products} />}
      </main>

      {/* ── Carrito ── */}
      <div className={`cart-backdrop ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-sidebar-header">
          <h3>Bolsa de Compras</h3>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <i className="fa-solid fa-bag-shopping"></i>
              <p>Tu bolsa está vacía</p>
              <span style={{ fontSize: '0.85rem', color: '#c0a0a8' }}>Agrega productos para comenzar tu compra</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img className="cart-item-img" src={item.urlImagen} alt={item.titulo} />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.titulo}</h4>
                  <span className="cart-item-meta">{item.categoria.nombre}</span>
                  <span className="cart-item-price">${item.precio.toLocaleString()}</span>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => {
                      if(item.cantidad > 1) {
                         decreaseQuantity(item.id);
                      } else {
                         removeFromCart(item.id);
                      }
                    }}><i className="fa-solid fa-minus"></i></button>
                    <span className="qty-val">{item.cantidad}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}><i className="fa-solid fa-plus"></i></button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-sidebar-footer">
          <div className="cart-totals">
            <span>Subtotal:</span>
            <span className="total-price">${cartTotal.toLocaleString()}</span>
          </div>
          <p className="cart-shipping-notice"><i className="fa-solid fa-truck-fast"></i> ¡Envío gratis a partir de $15,000!</p>
          <button className="btn btn-pink btn-block btn-lg" onClick={() => {
            if (cart.length > 0) {
              if (!user) {
                setIsAuthOpen(true);
              } else {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }
            }
          }}>
            <i className="fa-solid fa-credit-card"></i> Proceder al Pago
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <span className="logo-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></span>
              <span className="logo-text">Chic Rose</span>
            </div>
            <p>Tu destino número uno para moda femenina exclusiva. Diseños románticos, elegantes y con el toque moderno que mereces.</p>
            <div className="social-links">
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-tiktok"></i></a>
              <a href="#"><i className="fa-brands fa-pinterest"></i></a>
              <a href="#"><i className="fa-brands fa-facebook"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Categorías</h3>
            <ul>
              {CATEGORIAS.filter(c => c !== 'Todos').map(cat => (
                <li key={cat}>
                  <a href="#" className="footer-link-cat" onClick={e => { e.preventDefault(); setCategoriaActiva(cat); setView('shop-view'); }}>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3>Ayuda & Soporte</h3>
            <ul>
              <li><a href="#">Guía de Tallas</a></li>
              <li><a href="#">Políticas de Envío</a></li>
              <li><a href="#">Cambios y Devoluciones</a></li>
              <li><a href="#">Términos de Servicio</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            <p><i className="fa-solid fa-location-dot"></i> Palermo Hollywood, CABA</p>
            <p><i className="fa-solid fa-phone"></i> +54 (11) 5382-9900</p>
            <p><i className="fa-solid fa-envelope"></i> consultas@chicrose.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Chic Rose S.A. Todos los derechos reservados. Diseñado en Tonos Rosas con Elegancia.</p>
        </div>
      </footer>

      {/* ── Modal de Producto ── */}
      {selectedProduct && (
        <div className="modal-overlay active" onClick={() => setSelectedProduct(null)}>
          <div className="modal-container product-modal-container glass-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="product-modal-grid">
              <div className="product-modal-gallery">
                <img src={selectedProduct.urlImagen} alt={selectedProduct.titulo} />
              </div>
              <div className="product-modal-info">
                <span className="modal-product-cat">{selectedProduct.categoria.nombre}</span>
                <h2 className="modal-product-title">{selectedProduct.titulo}</h2>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-pink)', margin: '15px 0' }}>
                  ${selectedProduct.precio.toLocaleString()}
                </div>
                <p style={{ color: 'var(--medium-rose)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {selectedProduct.descripcion || 'Prenda exclusiva diseñada para realzar tu belleza natural con la máxima suavidad y estilo.'}
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 700, display: 'block', marginBottom: '8px' }}>Talle</label>
                  <select className="form-control" style={{ width: '150px' }}>
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
                <button
                  className="btn btn-pink btn-lg"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                >
                  <i className="fa-solid fa-bag-shopping"></i> Añadir a la Bolsa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalLogin isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ModalCheckout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
};

export default LegacyFront;
