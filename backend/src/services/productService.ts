import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productService = {
  getAllProducts: async () => {
    return await prisma.producto.findMany({
      include: { categoria: true },
    });
  },

  createProduct: async (data: any) => {
    const { sku, titulo, precio, stock, urlImagen, descripcion, nombreCategoria } = data;

    let categoria = await prisma.categoria.findUnique({ where: { nombre: nombreCategoria } });
    if (!categoria) {
      categoria = await prisma.categoria.create({ data: { nombre: nombreCategoria } });
    }

    return await prisma.producto.create({
      data: {
        sku,
        titulo,
        precio: Number(precio),
        stock: Number(stock),
        urlImagen,
        descripcion,
        categoriaId: categoria.id,
      },
      include: { categoria: true },
    });
  },

  updateProduct: async (id: number, data: any) => {
    const { sku, titulo, precio, stock, urlImagen, descripcion, nombreCategoria } = data;

    let categoriaId;
    if (nombreCategoria) {
      let categoria = await prisma.categoria.findUnique({ where: { nombre: nombreCategoria } });
      if (!categoria) {
        categoria = await prisma.categoria.create({ data: { nombre: nombreCategoria } });
      }
      categoriaId = categoria.id;
    }

    return await prisma.producto.update({
      where: { id },
      data: {
        ...(sku && { sku }),
        ...(titulo && { titulo }),
        ...(precio !== undefined && { precio: Number(precio) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(urlImagen && { urlImagen }),
        ...(descripcion && { descripcion }),
        ...(categoriaId && { categoriaId }),
      },
      include: { categoria: true },
    });
  },

  deleteProduct: async (id: number) => {
    return await prisma.producto.delete({
      where: { id },
    });
  }
};
