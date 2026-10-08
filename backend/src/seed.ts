import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@chic.com' },
    update: {},
    create: {
      nombre: 'Admin Chic Rose',
      email: 'admin@chic.com',
      contrasena: adminPassword,
      rol: 'admin',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create client user
  const clientPassword = await bcrypt.hash('cliente123', 10);
  const client = await prisma.usuario.upsert({
    where: { email: 'cliente@chic.com' },
    update: {},
    create: {
      nombre: 'Cliente de Prueba',
      email: 'cliente@chic.com',
      contrasena: clientPassword,
      rol: 'cliente',
    },
  });

  console.log(`✅ Client user created: ${client.email}`);

  // Create categories
  const categoryVestidos = await prisma.categoria.upsert({
    where: { nombre: 'Vestidos' },
    update: {},
    create: { nombre: 'Vestidos' },
  });

  const categoryBlusas = await prisma.categoria.upsert({
    where: { nombre: 'Blusas' },
    update: {},
    create: { nombre: 'Blusas' },
  });

  const categoryAbrigos = await prisma.categoria.upsert({
    where: { nombre: 'Abrigos' },
    update: {},
    create: { nombre: 'Abrigos' },
  });

  const categoryAccesorios = await prisma.categoria.upsert({
    where: { nombre: 'Accesorios' },
    update: {},
    create: { nombre: 'Accesorios' },
  });

  const categoryPolleras = await prisma.categoria.upsert({
    where: { nombre: 'Polleras' },
    update: {},
    create: { nombre: 'Polleras' },
  });

  const categoryPantalones = await prisma.categoria.upsert({
    where: { nombre: 'Pantalones' },
    update: {},
    create: { nombre: 'Pantalones' },
  });

  const categoryCalzado = await prisma.categoria.upsert({
    where: { nombre: 'Calzado' },
    update: {},
    create: { nombre: 'Calzado' },
  });

  console.log('✅ Categorías creadas');

  // ═══════════════════════ PRODUCTOS ═══════════════════════
  const allProducts = [
    // ── Vestidos ──
    { sku: 'VEST-01', titulo: 'Vestido Romantic Pink', precio: 15500, stock: 15, urlImagen: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600', descripcion: 'Vestido de gala en tonos rosados con gasa plisada premium. Cuello en V y espalda descubierta con lazo ajustable, ideal para eventos de primavera.', categoriaId: categoryVestidos.id },
    { sku: 'VEST-02', titulo: 'Vestido Floral Elegance', precio: 18500, stock: 12, urlImagen: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600', descripcion: 'Vestido largo con estampado floral, perfecto para el verano. Tela liviana de viscosa con cintura fruncida.', categoriaId: categoryVestidos.id },
    { sku: 'VEST-03', titulo: 'Vestido Cocktail Terciopelo Borgoña', precio: 11200, stock: 6, urlImagen: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=600', descripcion: 'Vestido corto de terciopelo en tono borgoña profundo con escote bardot. Corte ajustado con falda acampanada para cenas elegantes.', categoriaId: categoryVestidos.id },
    { sku: 'VEST-04', titulo: 'Vestido Gala Rose Gold', precio: 22000, stock: 4, urlImagen: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600', descripcion: 'Exclusivo vestido de noche entallado en satén premium tono oro rosa. Escote lencero con tiras cruzadas y tajo lateral sensual.', categoriaId: categoryVestidos.id },
    { sku: 'VEST-05', titulo: 'Vestido Lino Blanco Mediterráneo', precio: 7200, stock: 14, urlImagen: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600', descripcion: 'Vestido midi de lino puro blanco con tirantes finos y botones de nácar. Corte relajado perfecto para verano.', categoriaId: categoryVestidos.id },
    { sku: 'VEST-06', titulo: 'Vestido Wrap Seda Estampado', precio: 13400, stock: 5, urlImagen: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600', descripcion: 'Vestido cruzado (wrap) en seda estampada con motivos geométricos nude y rosa. Manga tres cuartos, versátil para oficina o salidas.', categoriaId: categoryVestidos.id },

    // ── Blusas ──
    { sku: 'BLUS-01', titulo: 'Blusa Seda Rose', precio: 8900, stock: 25, urlImagen: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=600', descripcion: 'Blusa de seda suave en tono rosa pastel con mangas caídas y escote corazón.', categoriaId: categoryBlusas.id },
    { sku: 'BLUS-02', titulo: 'Blusa Blanca Clásica', precio: 7500, stock: 30, urlImagen: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600', descripcion: 'Blusa blanca de algodón con cuello en V. Básico esencial para cualquier guardarropa.', categoriaId: categoryBlusas.id },
    { sku: 'BLUS-03', titulo: 'Blusa Gasa Encaje Vintage', precio: 4900, stock: 7, urlImagen: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=600', descripcion: 'Gasa semitransparente con mangas abullonadas y apliques de encaje floral. Clásico atemporal romántico.', categoriaId: categoryBlusas.id },
    { sku: 'BLUS-04', titulo: 'Top Crop Satén Rosa Empolvado', precio: 3800, stock: 15, urlImagen: 'https://images.unsplash.com/photo-1564246544814-647f76867e5b?auto=format&fit=crop&q=80&w=600', descripcion: 'Top corto de satén rosa empolvado con tirantes finos ajustables. Ideal para combinar con tiro alto o faldas midi.', categoriaId: categoryBlusas.id },
    { sku: 'BLUS-05', titulo: 'Blusa Lazo Cuello Victoriana', precio: 6200, stock: 8, urlImagen: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600', descripcion: 'Mangas largas con gran lazo al cuello estilo victoriano en crepé de seda crema. Elegancia para la oficina.', categoriaId: categoryBlusas.id },
    { sku: 'BLUS-06', titulo: 'Camiseta Básica Modal Soft', precio: 2800, stock: 30, urlImagen: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&q=80&w=600', descripcion: 'Camiseta manga corta en modal ultrasuave rosa antiguo. Cuello redondo, corte recto. Comodín para el día a día.', categoriaId: categoryBlusas.id },

    // ── Abrigos ──
    { sku: 'ABRI-01', titulo: 'Saco Elegance Pink', precio: 24500, stock: 10, urlImagen: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600', descripcion: 'Saco de abrigo con corte entallado y botones perlados. Mezcla de lana con forro de satén.', categoriaId: categoryAbrigos.id },
    { sku: 'ABRI-02', titulo: 'Abrigo de Lana Invierno', precio: 32000, stock: 8, urlImagen: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=600', descripcion: 'Abrigo de lana gruesa, ideal para climas fríos. Solapas estructuradas y botones cruzados.', categoriaId: categoryAbrigos.id },
    { sku: 'ABRI-03', titulo: 'Blazer Estructura Power Rose', precio: 14500, stock: 7, urlImagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600', descripcion: 'Blazer entallado doble botonadura rosa maquillaje. Hombreras suaves, bolsillos de solapa. Look ejecutivo y poderoso.', categoriaId: categoryAbrigos.id },
    { sku: 'ABRI-04', titulo: 'Cardigan Largo Punto Grueso', precio: 8700, stock: 9, urlImagen: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a50?auto=format&fit=crop&q=80&w=600', descripcion: 'Cardigan extra largo en punto grueso lana merino color avena. Sin botones, bolsillos amplios laterales.', categoriaId: categoryAbrigos.id },
    { sku: 'ABRI-05', titulo: 'Trench Coat Clásico Beige Rosado', precio: 18500, stock: 4, urlImagen: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600', descripcion: 'Trench coat gabardina premium beige rosado. Cinturón, doble fila de botones y largo hasta la rodilla. Ícono atemporal.', categoriaId: categoryAbrigos.id },
    { sku: 'ABRI-06', titulo: 'Sweater Cachemira Pastel Sweet', precio: 9200, stock: 5, urlImagen: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&q=80&w=600', descripcion: 'Punto trenzado en mezcla de cachemira y lana fina. Cuello redondo, puños acanalados, fit relajado acogedor.', categoriaId: categoryAbrigos.id },

    // ── Polleras ──
    { sku: 'POLL-01', titulo: 'Falda Midi Romántica de Tul', precio: 5800, stock: 10, urlImagen: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600', descripcion: 'Falda midi vaporosa en tres capas de tul plisado rosa pastel. Cintura elastizada de satén brillante.', categoriaId: categoryPolleras.id },
    { sku: 'POLL-02', titulo: 'Falda Lápiz Cuero Ecológico', precio: 6500, stock: 8, urlImagen: 'https://images.unsplash.com/photo-1592301933927-35b597393c0a?auto=format&fit=crop&q=80&w=600', descripcion: 'Falda tubo cuero ecológico negro con cintura alta y cierre posterior. Sofisticación rockera para noche u oficina.', categoriaId: categoryPolleras.id },
    { sku: 'POLL-03', titulo: 'Falda Plisada Satén Champagne', precio: 7100, stock: 6, urlImagen: 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&q=80&w=600', descripcion: 'Falda midi plisada satén champagne con cintura elástica oculta. Movimiento elegante para looks de fiesta.', categoriaId: categoryPolleras.id },
    { sku: 'POLL-04', titulo: 'Mini Falda Jean Rosa Pastel', precio: 4300, stock: 12, urlImagen: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600', descripcion: 'Minifalda denim rosa pastel con botones metálicos y ruedo deshilachado. Estilo casual y juvenil.', categoriaId: categoryPolleras.id },

    // ── Pantalones ──
    { sku: 'PANT-01', titulo: 'Pantalón Palazzo Lino Natural', precio: 7900, stock: 10, urlImagen: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600', descripcion: 'Pierna ultra ancha en lino natural color crema. Cintura alta con pinzas, elegante para eventos diurnos o verano.', categoriaId: categoryPantalones.id },
    { sku: 'PANT-02', titulo: 'Jean Mom Fit Rosa Viejo', precio: 6800, stock: 14, urlImagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600', descripcion: 'Jean tiro alto denim premium rosa viejo. Corte recto relajado estilo mom. Comodidad con personalidad.', categoriaId: categoryPantalones.id },
    { sku: 'PANT-03', titulo: 'Pantalón Sastre Recto Negro', precio: 8200, stock: 9, urlImagen: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600', descripcion: 'Pantalón de vestir recto gabardina negra con raya marcada. Look profesional pulido que nunca falla.', categoriaId: categoryPantalones.id },
    { sku: 'PANT-04', titulo: 'Leggins Cuero Eco Brillante', precio: 5500, stock: 16, urlImagen: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=600', descripcion: 'Leggins cuero ecológico brillante negro. Cintura alta elástica, stretch total. Ideales para salidas nocturnas.', categoriaId: categoryPantalones.id },

    // ── Accesorios ──
    { sku: 'ACC-01', titulo: 'Bolso Mini Rose', precio: 12000, stock: 30, urlImagen: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=600', descripcion: 'Bolso de mano en cuero ecológico rosa.', categoriaId: categoryAccesorios.id },
    { sku: 'ACC-02', titulo: 'Cinturón Fino Dorado Cadena', precio: 2400, stock: 20, urlImagen: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600', descripcion: 'Cadena metálica dorada con eslabones delicados. Se usa en la cintura para marcar silueta con toque glam.', categoriaId: categoryAccesorios.id },
    { sku: 'ACC-03', titulo: 'Pañuelo Seda Estampado Cadenas', precio: 3500, stock: 18, urlImagen: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600', descripcion: 'Pañuelo cuadrado seda pura con estampado barroco en rosa, dorado y crema. Versátil: cuello, cabeza o bolso.', categoriaId: categoryAccesorios.id },
    { sku: 'ACC-04', titulo: 'Clutch Fiesta Cristales Rose', precio: 5200, stock: 5, urlImagen: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600', descripcion: 'Cartera de mano rígida cubierta en cristales facetados rosa y plata. Cadena desmontable para bandolera.', categoriaId: categoryAccesorios.id },
    { sku: 'ACC-05', titulo: 'Gafas de Sol Cat Eye Vintage', precio: 4100, stock: 12, urlImagen: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=600', descripcion: 'Marco cat-eye acetato rosa traslúcido, lentes degradé marrón UV400. Diseño retro glamuroso para verano.', categoriaId: categoryAccesorios.id },
    { sku: 'ACC-06', titulo: 'Sombrero Pamela Algodón Soft', precio: 3100, stock: 15, urlImagen: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=600', descripcion: 'Sombrero ala ancha algodón y rafia crema-rubor. Cinta grosgrain rosa. Elegancia campestre con protección solar.', categoriaId: categoryAccesorios.id },

    // ── Calzado ──
    { sku: 'CALZ-01', titulo: 'Stiletto Rosa Charol Clásico', precio: 11800, stock: 6, urlImagen: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600', descripcion: 'Tacón alto 10 cm en charol rosa, punta afilada y suela de cuero. Indispensable para toda ocasión de gala.', categoriaId: categoryCalzado.id },
    { sku: 'CALZ-02', titulo: 'Sandalias Tiras Doradas Minimal', precio: 6200, stock: 10, urlImagen: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=600', descripcion: 'Sandalias planas de tiras finas cuero metalizado dorado. Diseño minimalista, perfectas para verano.', categoriaId: categoryCalzado.id },
    { sku: 'CALZ-03', titulo: 'Botas Caña Alta Cuero Blush', precio: 16500, stock: 4, urlImagen: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600', descripcion: 'Botas hasta la rodilla en cuero suave blush. Tacón bloque 6 cm, cierre lateral. Para otoño-invierno.', categoriaId: categoryCalzado.id },
    { sku: 'CALZ-04', titulo: 'Zapatillas Urbanas Rosa & Blanco', precio: 8900, stock: 15, urlImagen: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600', descripcion: 'Sneakers plataforma baja cuero blanco con detalles rosa. Memory foam. Sport-chic para el día a día.', categoriaId: categoryCalzado.id },
  ];

  for (const p of allProducts) {
    await prisma.producto.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }

  console.log(`✅ ${allProducts.length} productos creados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
