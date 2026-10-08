# Resumen General del Proyecto: Chic Rose

Este documento presenta una descripción detallada de la arquitectura, componentes, base de datos y flujos lógicos del proyecto **Chic Rose** (excluyendo el módulo del Estilista Virtual).

---

## 1. Visión General del Proyecto
**Chic Rose** es una plataforma de comercio electrónico (e-commerce) dedicada a la moda femenina. Está construida bajo una arquitectura desacoplada:
*   **Frontend**: SPA desarrollada en **React** con **TypeScript**, utilizando **Vite** como empaquetador y **Vanilla CSS** para el diseño visual de estilo romántico (tonos rosas, tarjetas con efecto glassmorphism y micro-animaciones).
*   **Backend**: Servidores basados en **Express** y **Node.js** que interactúan con una base de datos relacional local **SQLite** utilizando el ORM **Prisma**.
    *   *Nota*: El workspace cuenta con dos implementaciones del backend: un directorio `backend` modularizado en TypeScript y un directorio `server` monolítico en JavaScript. El frontend consulta al servidor a través de la URL base `http://localhost:3001/api`.

---

## 2. Estructura y Modelo de Datos (Base de Datos)
La persistencia de datos se maneja mediante un esquema definido en Prisma (`backend/prisma/schema.prisma`), estructurando las siguientes entidades:

*   **Usuario (`usuarios`)**:
    *   `id` (Int, Autoincremental, PK)
    *   `nombre` (String)
    *   `email` (String, Único)
    *   `contrasena` (String, encriptada con bcrypt)
    *   `rol` (String: `"cliente"` o `"admin"`, por defecto `"cliente"`)
    *   `creadoEn` (DateTime)
    *   Relación: Un usuario puede realizar múltiples pedidos.
*   **Categoria (`categorias`)**:
    *   `id` (Int, Autoincremental, PK)
    *   `nombre` (String, Único)
    *   Relación: Contiene múltiples productos.
*   **Producto (`productos`)**:
    *   `id` (Int, Autoincremental, PK)
    *   `sku` (String, Único)
    *   `titulo` (String)
    *   `precio` (Float)
    *   `stock` (Int)
    *   `urlImagen` (String)
    *   `descripcion` (String)
    *   `categoriaId` (Int, FK hacia Categoria)
    *   `creadoEn` (DateTime)
*   **Pedido (`pedidos`)**:
    *   `id` (Int, Autoincremental, PK)
    *   `numeroPedido` (String, Único, ej: `ORD-171928...`)
    *   `nombreCliente` (String)
    *   `emailCliente` (String)
    *   `direccion` (String)
    *   `total` (Float)
    *   `estado` (String, por defecto `"Preparando"`)
    *   `metodoPago` (String)
    *   `detallesPago` (String)
    *   `usuarioId` (Int, Opcional, FK hacia Usuario)
    *   `creadoEn` (DateTime)
    *   Relación: Contiene múltiples detalles del pedido (`DetallePedido`).
*   **DetallePedido (`detalles_pedido`)**:
    *   `id` (Int, Autoincremental, PK)
    *   `pedidoId` (Int, FK hacia Pedido)
    *   `productoId` (Int, FK hacia Producto)
    *   `cantidad` (Int)
    *   `precio` (Float - precio histórico del producto al momento de la compra)

---

## 3. Arquitectura del Backend
El backend principal (`backend/src`) está estructurado bajo el patrón de diseño Controlador-Servicio:

### 3.1. Servicios y Controladores
1.  **Módulo de Autenticación (`authController.ts` y `authService.ts`)**:
    *   **Registro (`registerUser`)**: Valida la existencia previa del correo, encripta la contraseña con `bcrypt` (10 rondas), guarda el usuario en la BD con rol `"cliente"`, y genera un token JWT.
    *   **Inicio de Sesión (`loginUser`)**: Verifica las credenciales contrastando el correo y validando el hash de la contraseña. Devuelve los datos públicos del usuario y su respectivo token JWT.
2.  **Módulo de Productos (`productController.ts` y `productService.ts`)**:
    *   **Lectura (`getAllProducts`)**: Obtiene la lista completa de productos disponibles, incluyendo los datos de su categoría asociada.
    *   **Creación (`createProduct`)**: Inserta un nuevo producto. Si la categoría suministrada no existe en la base de datos, la crea dinámicamente antes de registrar el producto.
    *   **Modificación (`updateProduct`)**: Actualiza selectivamente las propiedades de un producto (SKU, título, stock, precio, etc.).
    *   **Eliminación (`deleteProduct`)**: Remueve un producto del inventario mediante su identificador.
3.  **Módulo de Órdenes (`orderController.ts` y `orderService.ts`)**:
    *   **Creación de Pedidos (`createOrder`)**: Registra la orden de compra y las líneas de detalle (`DetallePedido`) en una única transacción de base de datos. Genera un identificador de pedido único con prefijo `ORD-`.
    *   **Visualización de Órdenes**: Permite obtener la lista total de órdenes (exclusivo para administración) o las órdenes realizadas por un usuario específico mediante su ID extraído del token.
    *   **Actualización de Estado (`updateOrderStatus`)**: Modifica el estado del envío o preparación de una compra en particular.

### 3.2. Middleware y Utilidades
*   **`authMiddleware.ts`**: Intercepta y valida que las peticiones http contengan un token JWT válido en su cabecera `Authorization: Bearer <Token>`. Adjunta la información del usuario autenticado a la petición (`req.user`) o deniega el acceso si el token falta o expiró.
*   **Token JWT (`utils/auth.ts`)**: Genera firmas digitales con tiempo de expiración para validar la identidad y el rol del usuario en peticiones subsecuentes.
*   **Tiempo Real / Server-Sent Events (SSE)**: El controlador de órdenes expone el endpoint `GET /api/orders/stream`. Este canal mantiene conexiones HTTP abiertas (`keep-alive`) con los clientes administrativos. Cada vez que se crea un pedido de forma exitosa en el servidor, este emite de forma reactiva y en tiempo real la información de la orden a todas las pantallas de administración abiertas.

---

## 4. Arquitectura del Frontend
El frontend se organiza como una Single Page Application (SPA) con componentes reactivos modulares.

### 4.1. Configuración de API e Interceptores
*   **`configuracionAPI.ts`**: Crea una instancia central de `axios` con la URL base del servidor de desarrollo (`http://localhost:3001/api`). Configura un **interceptor de peticiones** que extrae automáticamente el JWT de `localStorage` y lo añade a todas las llamadas externas en el encabezado `Authorization`.

### 4.2. Contextos Globales (State Management)
*   **`ContextoAutenticacion.tsx`**: Provee el estado `user` y `token` a toda la aplicación. Se sincroniza con el `localStorage` para mantener la sesión del usuario iniciada de forma persistente a través de recargas de la página. Expone métodos de `login` y `logout`.
*   **`ContextoCarrito.tsx`**: Administra la bolsa de compras. Implementa funciones para:
    *   Agregar productos (`addToCart`), incrementando la cantidad si ya se encuentra seleccionado.
    *   Disminuir cantidades (`decreaseQuantity`) o remover ítems completos (`removeFromCart`).
    *   Calcular el monto total acumulado (`total`) multiplicando cantidades por precios unitarios en tiempo real.

### 4.3. Flujo de Navegación y Vistas (`PaginaPrincipal.tsx`)
La aplicación conmuta sus vistas dinámicamente mediante el estado `view`:
1.  **Tienda (`shop-view`)**: Presenta la colección, banner de promociones, carrusel de categorías (Vestidos, Blusas, Calzado, etc.), y la grilla de productos con filtros y buscador integrado.
2.  **Panel de Administración (`admin-view`)**: Habilitado únicamente para usuarios con rol `"admin"`.
3.  **Mi Cuenta (`profile-view`)**: Muestra información del usuario, alertas o historial dependiendo de su rol.

### 4.4. Componentes y Modales (`frontend/src/components/`)
*   **`ModalLogin.tsx`**: Integra un formulario interactivo con pestañas de "Iniciar Sesión" y "Registrarse". Envía solicitudes HTTP al backend y almacena el perfil devuelto y token en el contexto de autenticación en caso de éxito.
*   **`ModalCheckout.tsx`**: Se abre al procesar la bolsa de compras. Solicita información de contacto, dirección y métodos de pago (Tarjeta de Crédito, Débito o Transferencia Bancaria). Envia la solicitud de orden al servidor incluyendo los detalles de los productos del carrito.
*   **`PanelAdmin.tsx`**: Dividido en dos grandes secciones:
    *   **Estadísticas de Ventas**: Renderiza KPIs de ingresos y volumen con tarjetas informativas. Incorpora gráficos visuales con curvas suavizadas de ventas semanales y barras de facturación mensual usando la librería **Recharts**.
    *   **Monitoreo en Tiempo Real**: Inicia una conexión a la API SSE utilizando `EventSource`. Si un cliente realiza una compra, el panel del administrador reacciona inmediatamente disparando un aviso emergente que detalla el cliente y total facturado.
    *   **Inventario de Productos**: Lista todos los productos en una tabla administrativa con botones para editar y eliminar ítems, así como un modal para la creación y guardado de productos nuevos.
*   **`VistaPerfil.tsx`**:
    *   *Modo Cliente*: Permite visualizar la lista de compras del usuario.
    *   *Modo Admin*: Muestra un **Historial de Acciones** administrativas (registra cuándo se crearon, actualizaron o eliminaron productos en la sesión del navegador) y un panel prioritario de **Alertas de Stock** que resalta en color rojo o naranja los productos sin existencias o con unidades críticas (stock menor o igual a 5).
