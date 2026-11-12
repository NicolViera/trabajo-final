import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { LOW_STOCK_THRESHOLD } from '../config';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const productos = await productService.getAllProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const productos = await productService.getLowStock();
    res.json({ umbral: LOW_STOCK_THRESHOLD, productos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las alertas de stock' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const producto = await productService.createProduct(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const producto = await productService.updateProduct(Number(id), req.body);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(Number(id));
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
