import { AuthProvider } from './context/ContextoAutenticacion';
import { CartProvider } from './context/ContextoCarrito';
import PaginaPrincipal from './PaginaPrincipal';

const App = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <PaginaPrincipal />
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
