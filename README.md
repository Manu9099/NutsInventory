# NutsInventory

Sistema full-stack de **inventario, órdenes, fidelización y analítica** para una tienda online de frutos secos.

Incluye:

* **Backend** en .NET 10 con Clean Architecture + CQRS
* **Panel admin** en React + TypeScript + Tailwind
* **Storefront cliente** en React para catálogo, detalle de producto y carrito
* **PostgreSQL** como base de datos principal
* **JWT Authentication** para acceso al panel administrativo

---

## Overview

**NutsInventory** es un proyecto diseñado como solución real para un ecommerce de frutos secos.

El sistema permite administrar:

* catálogo de productos
* stock y reposición
* clientes
* órdenes
* programa de fidelización por puntos
* dashboard con métricas comerciales
* trazabilidad de movimientos de inventario

Además, cuenta con una capa cliente orientada a venta, con experiencia visual tipo storefront para mostrar productos, explorar el catálogo y simular un flujo de compra.

---

## Main Features

### Admin Panel

* Dashboard con KPIs principales
* Productos: crear, editar, reactivar, desactivar y restock
* Clientes: registro, búsqueda, resumen loyalty y transacciones
* Órdenes: creación con selección de cliente, productos y canje de puntos
* Movimientos de inventario: auditoría y filtros por producto
* Autenticación JWT para proteger acciones sensibles

### Storefront

* Home comercial con hero, categorías y productos destacados
* Catálogo conectado a productos reales del backend
* Detalle de producto
* Carrito lateral + página de carrito
* Base lista para evolucionar a checkout

### Business Logic

* Descuento de stock al registrar una orden
* Acumulación de puntos de fidelización
* Canje de puntos al crear pedidos
* Actualización de métricas de ventas
* Segmentación simple por tiers de cliente

---

## Tech Stack

### Backend

* .NET 10
* ASP.NET Core Minimal APIs
* Entity Framework Core
* PostgreSQL
* MediatR
* FluentValidation
* JWT Bearer Authentication

### Frontend Admin

* React
* TypeScript
* React Router
* Zustand
* Tailwind CSS
* Recharts
* Framer Motion

### Frontend Storefront

* React
* TypeScript
* React Router
* Tailwind CSS
* Framer Motion

---

## Architecture

El backend sigue una estructura inspirada en **Clean Architecture**:

* **Domain** → entidades y lógica del dominio
* **Application** → casos de uso, handlers, validaciones, contratos
* **Infrastructure** → EF Core, persistencia y acceso a datos
* **API** → endpoints, auth, middleware, configuración

También se usa un enfoque tipo **CQRS** con MediatR para separar comandos y queries.

---

## Modules

### 1. Products

* Listado de productos
* Búsqueda
* Creación y edición
* Restock
* Activación / desactivación
* Detección de low stock

### 2. Customers

* Registro de clientes
* Consulta por búsqueda
* Resumen de fidelización
* Historial de transacciones de puntos

### 3. Orders

* Creación de órdenes
* Selección de cliente
* Selección de productos
* Resumen de compra
* Canje de puntos
* Cálculo de puntos ganados

### 4. Inventory Movements

* Auditoría de movimientos
* Filtros por producto
* Visualización de cambios previos y nuevos de stock

### 5. Dashboard & Analytics

* Summary KPIs
* Top sellers
* Monthly sales trend
* Low stock products
* Recent inventory movements

### 6. Storefront

* Landing comercial
* Catálogo conectado al backend
* Product detail
* Carrito

---

## Project Structure

```bash
NutsInventory/
├── src/
│   ├── NutsInventory.Domain/
│   ├── NutsInventory.Application/
│   ├── NutsInventory.Infrastructure/
│   └── NutsInventory.Api/
├── tests/
│   └── NutsInventory.UnitTests/
├── nuts-inventory-web/         # Admin frontend
└── nuts-inventory-storefront/  # Client storefront
```

> Los nombres exactos de las carpetas frontend pueden variar según cómo organices el repo. Si decides mantener ambos frontends dentro de un solo workspace, puedes ajustar esta sección.

---

## Authentication

El panel admin usa **JWT Authentication**.

### Demo credentials

```txt
Email: admin@nutsinventory.com
Password: Admin123*
```

> Estas credenciales son únicamente para entorno de desarrollo/demo.

---

## Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/your-username/nutsinventory.git
cd nutsinventory
```

---

## 2. Backend setup

### Restore dependencies

```bash
dotnet restore
```

### Run migrations

```bash
dotnet ef database update --project .\src\NutsInventory.Infrastructure --startup-project .\src\NutsInventory.Api
```

### Run API

```bash
dotnet run --project .\src\NutsInventory.Api
```

La API quedará disponible localmente en una URL similar a:

```txt
http://localhost:5082
```

---

## 3. Admin frontend setup

```bash
cd nuts-inventory-web
npm install
npm run dev
```

---

## 4. Storefront setup

```bash
cd nuts-inventory-storefront
npm install
npm run dev
```

---

## Environment Notes

Backend:

* Configura tu conexión a PostgreSQL en `appsettings.Development.json`
* Configura la sección `Jwt`

Frontend:

* Ajusta la base URL del API si el puerto cambia
* Verifica que CORS permita el origen de Vite

---

## Example Backend Capabilities

### Products

* `GET /api/products`
* `POST /api/products`
* `PUT /api/products/{id}`
* `POST /api/products/{id}/restock`
* `PATCH /api/products/{id}/deactivate`
* `PATCH /api/products/{id}/reactivate`
* `GET /api/products/low-stock`

### Customers

* `GET /api/customers`
* `POST /api/customers`
* `GET /api/customers/{id}`
* `GET /api/customers/{id}/loyalty`
* `GET /api/customers/{id}/transactions`

### Orders

* `POST /api/orders`

### Dashboard

* `GET /api/dashboard/summary`
* `GET /api/dashboard/top-sellers`
* `GET /api/dashboard/monthly-sales-trend`

### Inventory

* `GET /api/inventory/movements`

### Auth

* `POST /api/auth/login`
* `GET /api/auth/me`

---

## UI / UX Goals

### Admin Panel

Diseñado para ser:

* claro
* rápido
* operativo
* limpio
* orientado a decisiones

### Storefront

Diseñado para ser:

* visual
* cálido
* comercial
* apetecible
* coherente con una marca saludable

---

## Why this project is valuable

Este proyecto demuestra experiencia en:

* diseño de backend real con capas
* manejo de reglas de negocio
* autenticación JWT
* consumo de API desde React
* dashboards y visualización de datos
* modelado de inventario y órdenes
* integración entre panel administrativo y frontend comercial

No es solo un CRUD: combina lógica operativa, fidelización, analítica y experiencia de usuario.

---

## Possible Next Steps

* checkout real
* historial de órdenes para cliente
* upload de imágenes de productos
* roles avanzados (admin / operador)
* refresh tokens
* tests de integración y e2e
* deploy full-stack
* reportes exportables
* pasarela de pagos

---

## Screenshots

Puedes agregar aquí capturas del proyecto:

```md
![Dashboard](./docs/screenshots/dashboard.png)
![Products](./docs/screenshots/products.png)
![Customers](./docs/screenshots/customers.png)
![Storefront](./docs/screenshots/storefront-home.png)
```

---

## Author

Desarrollado por **[Tu Nombre]**

Si quieres, puedes conectar aquí tu:

* LinkedIn
* portfolio
* correo
* GitHub

---

## License

Este proyecto fue desarrollado con fines académ
