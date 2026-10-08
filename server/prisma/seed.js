/**
 * SEED - Chic Rose
 * Carga los datos iniciales de productos, usuarios, órdenes y ventas en la DB.
 * Ejecutar con: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCTS = [
    // ═══════════════════════ VESTIDOS ═══════════════════════
    {
        id: "prod-1",
        code: "VEST-01",
        title: "Vestido Romantic Pink Plisado",
        description: "Delicado vestido confeccionado en gasa plisada premium de tono rosa pastel. Diseño de cuello en V y espalda descubierta con lazo ajustable, ideal para salidas románticas o eventos de día.",
        category: "Vestidos",
        price: 8500,
        stock: 8,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
        salesCount: 14
    },
    {
        id: "prod-7",
        code: "VEST-02",
        title: "Vestido Gala Rose Gold",
        description: "Exclusivo vestido de noche entallado en satén premium de gramaje pesado en tono oro rosa. Escote lencero con tiras cruzadas en la espalda abierta y un tajo lateral que aporta movimiento y sensualidad.",
        category: "Vestidos",
        price: 15500,
        stock: 4,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80",
        salesCount: 18
    },
    {
        id: "prod-9",
        code: "VEST-03",
        title: "Vestido Cocktail Terciopelo Borgoña",
        description: "Vestido corto de terciopelo en tono borgoña profundo con escote bardot. Corte ajustado al cuerpo con falda acampanada. Perfecto para cenas elegantes o fiestas de noche.",
        category: "Vestidos",
        price: 11200,
        stock: 6,
        image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&auto=format&fit=crop&q=80",
        salesCount: 10
    },
    {
        id: "prod-10",
        code: "VEST-04",
        title: "Vestido Maxi Boho Floral",
        description: "Vestido largo y fluido con estampado de flores silvestres en tonos tierra y rosa. Mangas campana, cintura fruncida con cordón y tela liviana de viscosa. Ideal para paseos al atardecer o brunch de fin de semana.",
        category: "Vestidos",
        price: 9800,
        stock: 10,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
        salesCount: 20
    },
    {
        id: "prod-11",
        code: "VEST-05",
        title: "Vestido Lino Blanco Mediterráneo",
        description: "Vestido midi de lino puro blanco con tirantes finos regulables y botones de nácar en el frente. Corte recto relajado perfecto para climas cálidos y looks de playa o ciudad de verano.",
        category: "Vestidos",
        price: 7200,
        stock: 14,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
        salesCount: 16
    },
    {
        id: "prod-12",
        code: "VEST-06",
        title: "Vestido Wrap Seda Estampado",
        description: "Vestido cruzado (wrap) confeccionado en seda estampada con motivos geométricos en tonos nude y rosa. Largo midi, manga tres cuartos y cinturón del mismo material. Versátil para oficina o salidas.",
        category: "Vestidos",
        price: 13400,
        stock: 5,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
        salesCount: 12
    },

    // ═══════════════════════ BLUSAS Y TOPS ═══════════════════════
    {
        id: "prod-3",
        code: "BLUS-01",
        title: "Top Floral Garden Silk",
        description: "Blusa delicada de mangas caídas y escote corazón, estampada con un sutil patrón de flores silvestres. Confeccionada en seda fría con terminaciones elásticas para un ajuste cómodo y favorecedor.",
        category: "Blusas",
        price: 4200,
        stock: 12,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
        salesCount: 22
    },
    {
        id: "prod-6",
        code: "BLUS-02",
        title: "Blusa Gasa Encaje Vintage",
        description: "Camisa de gasa semitransparente con mangas abullonadas e intrincados apliques de encaje floral en el pecho y cuello. Un clásico atemporal del guardarropa romántico y sofisticado.",
        category: "Blusas",
        price: 4900,
        stock: 7,
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&auto=format&fit=crop&q=80",
        salesCount: 9
    },
    {
        id: "prod-13",
        code: "BLUS-03",
        title: "Camisa Oversized Algodón Premium",
        description: "Camisa oversize de algodón orgánico en blanco óptico con cuello clásico y puños anchos. Corte relajado que se puede llevar por dentro o suelta. Básico esencial para cualquier guardarropa.",
        category: "Blusas",
        price: 5100,
        stock: 20,
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&auto=format&fit=crop&q=80",
        salesCount: 25
    },
    {
        id: "prod-14",
        code: "BLUS-04",
        title: "Top Crop Satén Rosa Empolvado",
        description: "Top corto de satén en rosa empolvado con tirantes finos ajustables y escote recto. Tela con caída suave y brillo sutil. Ideal para combinar con pantalones de tiro alto o faldas midi.",
        category: "Blusas",
        price: 3800,
        stock: 15,
        image: "https://images.unsplash.com/photo-1564246544814-647f76867e5b?w=600&auto=format&fit=crop&q=80",
        salesCount: 19
    },
    {
        id: "prod-15",
        code: "BLUS-05",
        title: "Blusa Lazo Cuello Victoriana",
        description: "Blusa de mangas largas con gran lazo en el cuello al estilo victoriano. Confeccionada en crepé de seda en tono crema. Botones forrados ocultos y puños con volado. Elegancia pura para la oficina o eventos formales.",
        category: "Blusas",
        price: 6200,
        stock: 8,
        image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&auto=format&fit=crop&q=80",
        salesCount: 7
    },
    {
        id: "prod-16",
        code: "BLUS-06",
        title: "Camiseta Básica Modal Soft",
        description: "Camiseta de manga corta en tela modal ultrasuave, tono rosa antiguo. Cuello redondo, corte recto y terminaciones invisibles. La prenda comodín perfecta para el día a día con estilo.",
        category: "Blusas",
        price: 2800,
        stock: 30,
        image: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=600&auto=format&fit=crop&q=80",
        salesCount: 35
    },

    // ═══════════════════════ ABRIGOS Y SWEATERS ═══════════════════════
    {
        id: "prod-2",
        code: "ABRI-01",
        title: "Saco Clásico Blush Wool",
        description: "Elegante abrigo largo confeccionado en mezcla de lana soft. Textura ultrasuave con forro interior de satén, botones cruzados en tono carey y solapas estructuradas para un estilo sofisticado en días fríos.",
        category: "Abrigos",
        price: 12900,
        stock: 5,
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
        salesCount: 8
    },
    {
        id: "prod-8",
        code: "ABRI-02",
        title: "Sweater Cachemira Pastel Sweet",
        description: "Sweater de punto trenzado confeccionado en mezcla de cachemira y lana fina. Cuello redondo clásico, puños acanalados y un fit relajado muy acogedor en una tonalidad rosa rubor sumamente delicada.",
        category: "Abrigos",
        price: 9200,
        stock: 2,
        image: "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=600&auto=format&fit=crop&q=80",
        salesCount: 15
    },
    {
        id: "prod-17",
        code: "ABRI-03",
        title: "Blazer Estructura Power Rose",
        description: "Blazer entallado de doble botonadura en tono rosa maquillaje. Hombreras suaves estructuradas, bolsillos de solapa y forro interior estampado. Transformá cualquier look casual en uno ejecutivo y poderoso.",
        category: "Abrigos",
        price: 14500,
        stock: 7,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
        salesCount: 11
    },
    {
        id: "prod-18",
        code: "ABRI-04",
        title: "Cardigan Largo Punto Grueso",
        description: "Cardigan extra largo en punto grueso de lana merino color avena. Sin botones, con bolsillos amplios laterales. La prenda ideal para tirarte encima en tardes frescas con un café en mano.",
        category: "Abrigos",
        price: 8700,
        stock: 9,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a50?w=600&auto=format&fit=crop&q=80",
        salesCount: 13
    },
    {
        id: "prod-19",
        code: "ABRI-05",
        title: "Trench Coat Clásico Beige Rosado",
        description: "Trench coat impermeable en gabardina premium tono beige rosado. Cinturón con hebilla, doble fila de botones, cuello amplio con solapa y largo hasta la rodilla. Un ícono de la moda atemporal.",
        category: "Abrigos",
        price: 18500,
        stock: 4,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80",
        salesCount: 6
    },
    {
        id: "prod-20",
        code: "ABRI-06",
        title: "Chaleco Puffer Nude Acolchado",
        description: "Chaleco acolchado ultraliviano con relleno de pluma sintética en color nude. Cierre frontal, bolsillos con cremallera y cuello alto protector. Calidez sin volumen para los looks de capas.",
        category: "Abrigos",
        price: 7800,
        stock: 11,
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&auto=format&fit=crop&q=80",
        salesCount: 9
    },

    // ═══════════════════════ POLLERAS / FALDAS ═══════════════════════
    {
        id: "prod-4",
        code: "POLL-01",
        title: "Falda Midi Romántica de Tul",
        description: "Falda midi vaporosa estructurada en tres capas de tul plisado rosa pastel. Cintura elastizada de satén brillante que se adapta perfectamente, ideal para lograr un look de bailarina chic moderno.",
        category: "Polleras",
        price: 5800,
        stock: 3,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
        salesCount: 11
    },
    {
        id: "prod-21",
        code: "POLL-02",
        title: "Falda Lápiz Cuero Ecológico",
        description: "Falda tubo de cuero ecológico en negro intenso con cintura alta y cierre posterior. Largo hasta la rodilla con pequeño tajo trasero para movilidad. Sofisticación rockera para salidas nocturnas o la oficina.",
        category: "Polleras",
        price: 6500,
        stock: 8,
        image: "https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=600&auto=format&fit=crop&q=80",
        salesCount: 14
    },
    {
        id: "prod-22",
        code: "POLL-03",
        title: "Falda Plisada Satén Champagne",
        description: "Falda midi plisada de satén en tono champagne con cintura elástica oculta. Pliegues regulares que crean un movimiento elegante al caminar. Combina con blazers o blusas para looks de fiesta o formales.",
        category: "Polleras",
        price: 7100,
        stock: 6,
        image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&auto=format&fit=crop&q=80",
        salesCount: 8
    },
    {
        id: "prod-23",
        code: "POLL-04",
        title: "Mini Falda Jean Rosa Pastel",
        description: "Minifalda de denim suave teñido en rosa pastel. Cierre con botones metálicos, bolsillos delanteros funcionales y ruedo deshilachado. Estilo casual y juvenil para el fin de semana o looks urbanos.",
        category: "Polleras",
        price: 4300,
        stock: 12,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
        salesCount: 17
    },

    // ═══════════════════════ PANTALONES ═══════════════════════
    {
        id: "prod-24",
        code: "PANT-01",
        title: "Pantalón Palazzo Lino Natural",
        description: "Pantalón de pierna ultra ancha en lino natural color crema. Cintura alta con pinzas y cierre lateral invisible. Fluido y elegante, ideal para eventos diurnos, vacaciones o looks de oficina en verano.",
        category: "Pantalones",
        price: 7900,
        stock: 10,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
        salesCount: 15
    },
    {
        id: "prod-25",
        code: "PANT-02",
        title: "Jean Mom Fit Rosa Viejo",
        description: "Jean de tiro alto en denim premium teñido en rosa viejo. Corte recto relajado estilo mom, cinco bolsillos clásicos. Un básico moderno que combina comodidad con personalidad.",
        category: "Pantalones",
        price: 6800,
        stock: 14,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
        salesCount: 22
    },
    {
        id: "prod-26",
        code: "PANT-03",
        title: "Pantalón Sastre Recto Negro",
        description: "Pantalón de vestir recto en gabardina negra con raya marcada al frente. Cintura media con trabillas y cierre con botón. Corte impecable para un look profesional y pulido que nunca falla.",
        category: "Pantalones",
        price: 8200,
        stock: 9,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80",
        salesCount: 18
    },
    {
        id: "prod-27",
        code: "PANT-04",
        title: "Leggins Cuero Eco Brillante",
        description: "Leggins de cuero ecológico con acabado brillante en negro. Cintura alta elástica súper cómoda y tela con stretch para movimiento total. Ideales para salidas nocturnas con tacones y blazer.",
        category: "Pantalones",
        price: 5500,
        stock: 16,
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80",
        salesCount: 20
    },

    // ═══════════════════════ ACCESORIOS ═══════════════════════
    {
        id: "prod-5",
        code: "ACCE-01",
        title: "Sombrero Pamela Algodón Soft",
        description: "Sombrero de ala ancha flexible, confeccionado en fibras de algodón y rafia color crema-rubor. Detalle de cinta de grosgrain rosa en contraste. Protege del sol aportando una elegancia campestre.",
        category: "Accesorios",
        price: 3100,
        stock: 15,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=600&auto=format&fit=crop&q=80",
        salesCount: 4
    },
    {
        id: "prod-28",
        code: "ACCE-02",
        title: "Bolso Tote Cuero Nude",
        description: "Bolso tote amplio de cuero genuino en tono nude con asas reforzadas y cierre magnético. Interior con bolsillo con cierre y organizador. Capacidad perfecta para el día a día con estilo profesional.",
        category: "Accesorios",
        price: 9800,
        stock: 7,
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&auto=format&fit=crop&q=80",
        salesCount: 12
    },
    {
        id: "prod-29",
        code: "ACCE-03",
        title: "Cinturón Fino Dorado Cadena",
        description: "Cinturón de cadena metálica dorada con eslabones delicados y cierre de gancho. Se usa en la cintura sobre vestidos, blusas o sacos para marcar la silueta con un toque glam y sofisticado.",
        category: "Accesorios",
        price: 2400,
        stock: 20,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
        salesCount: 8
    },
    {
        id: "prod-30",
        code: "ACCE-04",
        title: "Pañuelo Seda Estampado Cadenas",
        description: "Pañuelo cuadrado grande de seda pura con estampado de cadenas y motivos barrocos en tonos rosa, dorado y crema. Usalo en el cuello, la cabeza, como top o en el bolso para un toque chic.",
        category: "Accesorios",
        price: 3500,
        stock: 18,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
        salesCount: 6
    },
    {
        id: "prod-31",
        code: "ACCE-05",
        title: "Clutch Fiesta Cristales Rose",
        description: "Cartera de mano rígida para eventos, cubierta en cristales facetados en tono rosa y plata. Cadena desmontable para usar como bandolera. El broche perfecto para tu look de gala o noche especial.",
        category: "Accesorios",
        price: 5200,
        stock: 5,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&auto=format&fit=crop&q=80",
        salesCount: 10
    },
    {
        id: "prod-32",
        code: "ACCE-06",
        title: "Gafas de Sol Cat Eye Vintage",
        description: "Anteojos de sol con marco cat-eye en acetato rosa traslúcido y lentes degradé marrón con protección UV400. Diseño retro glamuroso que complementa cualquier look veraniego.",
        category: "Accesorios",
        price: 4100,
        stock: 12,
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&auto=format&fit=crop&q=80",
        salesCount: 14
    },

    // ═══════════════════════ CALZADO ═══════════════════════
    {
        id: "prod-33",
        code: "CALZ-01",
        title: "Stiletto Rosa Charol Clásico",
        description: "Zapato de tacón alto (10 cm) en charol rosa con punta afilada y suela de cuero. Tacón aguja estilizado que alarga la silueta. El zapato indispensable para toda ocasión de gala.",
        category: "Calzado",
        price: 11800,
        stock: 6,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
        salesCount: 9
    },
    {
        id: "prod-34",
        code: "CALZ-02",
        title: "Sandalias Tiras Doradas Minimal",
        description: "Sandalias planas de tiras finas en cuero metalizado dorado. Diseño minimalista con cierre en el tobillo. Comodidad absoluta sin resignar elegancia, perfectas para verano o eventos al aire libre.",
        category: "Calzado",
        price: 6200,
        stock: 10,
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=80",
        salesCount: 16
    },
    {
        id: "prod-35",
        code: "CALZ-03",
        title: "Botas Caña Alta Cuero Blush",
        description: "Botas de caña alta hasta la rodilla en cuero suave tono blush. Tacón bloque de 6 cm para comodidad, cierre lateral y punta redondeada. El complemento ideal para vestidos y faldas en otoño-invierno.",
        category: "Calzado",
        price: 16500,
        stock: 4,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
        salesCount: 7
    },
    {
        id: "prod-36",
        code: "CALZ-04",
        title: "Zapatillas Urbanas Rosa & Blanco",
        description: "Sneakers de plataforma baja en cuero blanco con detalles en rosa y suela de goma antideslizante. Plantilla acolchada memory foam. Estilo sport-chic para los looks casuales del día a día.",
        category: "Calzado",
        price: 8900,
        stock: 15,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
        salesCount: 28
    },
];

const USERS = [
    { name: "Administradora Chic", email: "admin@chic.com", password: "admin123", role: "admin" },
    { name: "Sofia Rodriguez",     email: "cliente@chic.com", password: "cliente123", role: "customer" }
];

// Genera datos de ventas de los últimos 5 días
function getSeedSales() {
    const today = new Date();
    const salesData = [
        { daysAgo: 4, revenue: 18500, count: 2 },
        { daysAgo: 3, revenue: 24300, count: 3 },
        { daysAgo: 2, revenue: 12900, count: 1 },
        { daysAgo: 1, revenue: 38400, count: 4 },
        { daysAgo: 0, revenue: 15500, count: 1 },
    ];
    return salesData.map(({ daysAgo, revenue, count }) => {
        const d = new Date(today);
        d.setDate(today.getDate() - daysAgo);
        return {
            date: d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
            rawDate: d.toISOString().split('T')[0],
            revenue,
            count
        };
    });
}

const ORDERS = [
    {
        id: "ORD-9801",
        customerName: "Sofia Rodriguez",
        customerEmail: "cliente@chic.com",
        total: 13300,
        status: "Entregado",
        address: "Av. Santa Fe 1234, CABA",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        userEmail: "cliente@chic.com",
        items: [
            { productId: "prod-3", title: "Top Floral Garden Silk",     price: 4200, qty: 2, size: "M", color: "Rosa Delicado" },
            { productId: "prod-6", title: "Blusa Gasa Encaje Vintage",  price: 4900, qty: 1, size: "S", color: "Blanco Puro" }
        ]
    },
    {
        id: "ORD-9802",
        customerName: "Sofia Rodriguez",
        customerEmail: "cliente@chic.com",
        total: 12900,
        status: "En camino",
        address: "Av. Santa Fe 1234, CABA",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userEmail: "cliente@chic.com",
        items: [
            { productId: "prod-2", title: "Saco Clásico Blush Wool", price: 12900, qty: 1, size: "L", color: "Rosa Rubor" }
        ]
    }
];

async function main() {
    console.log('🌸 Iniciando seed de Chic Rose...\n');

    // Limpiar tablas en orden correcto (por relaciones FK)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.saleDay.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️  Tablas limpiadas\n');

    // Cargar Productos
    for (const p of PRODUCTS) {
        await prisma.product.create({ data: p });
    }
    console.log(`✅ ${PRODUCTS.length} productos insertados`);

    // Cargar Usuarios
    for (const u of USERS) {
        await prisma.user.create({ data: u });
    }
    console.log(`✅ ${USERS.length} usuarios insertados`);

    // Cargar Ventas Diarias
    const sales = getSeedSales();
    for (const s of sales) {
        await prisma.saleDay.create({ data: s });
    }
    console.log(`✅ ${sales.length} registros de ventas insertados`);

    // Cargar Órdenes con sus ítems
    for (const order of ORDERS) {
        const { items, ...orderData } = order;
        await prisma.order.create({
            data: {
                ...orderData,
                items: { create: items }
            }
        });
    }
    console.log(`✅ ${ORDERS.length} órdenes insertadas\n`);

    console.log('🎉 ¡Seed completado exitosamente!');
    console.log('   Admin:   admin@chic.com / admin123');
    console.log('   Cliente: cliente@chic.com / cliente123');
}

main()
    .catch(e => { console.error('❌ Error en seed:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
