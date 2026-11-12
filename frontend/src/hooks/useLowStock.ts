import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/ContextoAutenticacion';
import api from '../configuracionAPI';

export interface LowStockProduct {
  id: number;
  titulo: string;
  stock: number;
}

// Solo para administradores. Se vuelve a pedir al servidor cada vez que cambia `refreshKey`.
export const useLowStock = (refreshKey?: unknown) => {
  const { user } = useContext(AuthContext);
  const [umbral, setUmbral] = useState(5);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    if (user?.rol !== 'admin') return;
    let cancelled = false;

    api
      .get('/products/low-stock')
      .then(({ data }) => {
        if (cancelled) return;
        setUmbral(data.umbral);
        setLowStock(data.productos);
      })
      .catch((err) => console.error('Error al cargar alertas de stock:', err));

    return () => {
      cancelled = true;
    };
  }, [user?.rol, refreshKey]);

  return { umbral, lowStock };
};
