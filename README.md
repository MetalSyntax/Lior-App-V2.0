# Lior Pedidos App

Aplicación web progresiva (PWA) de ventas y gestión de pedidos, diseñada con un enfoque **mobile-first** pero totalmente responsiva para tablets y escritorio. Permite a los clientes o vendedores autenticados seleccionar productos, gestionar un carrito de compras y generar órdenes de pedido exportables.

## 🚀 Características Principales

### 👤 Autenticación y Usuarios
- **Login de Selección:** Sistema de acceso simplificado mediante selección de usuario.
- **Búsqueda Inteligente:** El listado de usuarios permanece oculto hasta que se inicia una búsqueda por nombre o código, optimizando el rendimiento visual.
- **Avatares Generados:** Generación automática de iniciales basada en el nombre del usuario.

### 📦 Gestión de Productos
- **Catálogo Visual:** Listado de productos con precios, unidades e iconos representativos dinámicos según el tipo de producto (shampoo, cremas, colonias, etc.).
- **Filtros por Categoría:** Barra de navegación horizontal (scrollable) para filtrar productos por categorías como "Cuidado Capilar", "Perfumería", "Higiene", etc.
- **Búsqueda en Tiempo Real:** Filtrado instantáneo por nombre o código de producto (SKU).
- **Carrito Interactivo:** Controles para agregar (+) o quitar (-) unidades directamente desde la tarjeta del producto.

### 🛒 Carrito y Pedidos
- **Barra de Estado:** Indicador flotante (en móvil) o fijo (en escritorio) con el total de artículos y subtotal en tiempo real.
- **Resumen Detallado:** Vista desglosada del pedido antes de finalizar.
- **Exportación CSV:** Funcionalidad para descargar el pedido actual en formato `.csv` compatible con Excel, incluyendo detalles del cliente y fecha.

### 🎨 Diseño y UI/UX
- **Interfaz Responsiva:** Layout adaptable que utiliza grids para aprovechar el espacio en pantallas grandes (Tablet/Desktop) y listas verticales en móviles.
- **Feedback Visual:** Animaciones suaves al cargar elementos y transiciones de estado.
- **Estética Moderna:** Uso de gradientes, sombras suaves (`backdrop-filter`) y una paleta de colores corporativa (Naranja/Teal).

## 🛠️ Tecnologías Utilizadas

- **Core:** React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (vía CDN)
- **Iconos:** Lucide React
- **Empaquetado/Módulos:** ES Modules (configuración vía `importmap`)

## 📂 Estructura del Proyecto

```text
/
├── index.html              # Punto de entrada, configuración de Tailwind y Mapas de importación
├── index.tsx               # Montaje de la aplicación React en el DOM
├── App.tsx                 # Componente raíz y enrutador de estados (Vistas)
├── types.ts                # Definiciones de interfaces TypeScript (User, Product, Order, etc.)
├── constants.ts            # Base de datos local (JSONs de Usuarios y Productos) y lógica de negocio
├── metadata.json           # Metadatos de la aplicación
├── README.md               # Documentación del proyecto
└── components/
    ├── LoginScreen.tsx         # Vista de selección de usuario con buscador
    ├── DashboardScreen.tsx     # Panel principal (Menú simplificado)
    ├── ProductScreen.tsx       # Catálogo de productos, filtros y buscador
    └── OrderSummaryScreen.tsx  # Vista de confirmación y descarga de CSV
```

## 📋 Datos y Lógica de Negocio

La aplicación funciona actualmente con datos locales definidos en `constants.ts`:

- **Categorización Automática:** Los productos se clasifican automáticamente en categorías (Cuidado Capilar, Perfumería, etc.) basándose en palabras clave en su nombre.
- **Extracción de Unidades:** Se utiliza Regex para identificar y mostrar la unidad de medida (ml, gr, cc) de cada producto.

## 🔧 Instalación y Ejecución

Dado que el proyecto utiliza módulos de ES modernos y cargas vía CDN en el `index.html`, no requiere un proceso de compilación (build) tradicional para desarrollo, pero sí un servidor local para manejar las importaciones de módulos.

1. **Clonar el proyecto**
2. **Ejecutar servidor local:** Puedes usar cualquier servidor estático.
   Ejemplo con python:
   ```bash
   python3 -m http.server
   ```
   Ejemplo con Node (serve):
   ```bash
   npx serve .
   ```
3. **Acceder:** Abrir `http://localhost:3000` (o el puerto correspondiente) en el navegador.

> **Nota:** Se requiere conexión a internet para la primera carga debido a las dependencias de `esm.sh` y Tailwind CDN.
