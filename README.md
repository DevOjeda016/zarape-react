# El Zarape — Front (React)

MVP del front de El Zarape con **React 18 + Vite + React Router**. Consume la API de `zarape-springboot`.

## Ejecutar
```bash
cp .env.example .env.local   # opcional: ajusta VITE_API_URL (por defecto http://localhost:8080/api)
npm install
npm run dev                  # http://localhost:5173
npm run build
```
Levanta primero la API (`mvn spring-boot:run` en `zarape-springboot`).

## Pantallas
| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | público | Inicio con platillos destacados |
| `/menu` | público | Menú filtrable por tipo y categoría, agregar al carrito |
| `/sucursales` | público | Lista de sucursales |
| `/login` | público | Inicio de sesión y registro de clientes |
| `/carrito` | público (pedir requiere sesión) | Carrito, sucursal y forma de pago (tarjeta simulada / efectivo) |
| `/pedidos` | autenticado | Historial y estatus de mis pedidos |
| `/cocina` | ADMIN / EMPLOYEE | Comandas: marcar lista, entregar, cancelar (refresco cada 10 s) |
| `/admin` | ADMIN | CRUD de productos, categorías y sucursales |

Usuarios de demo (de la API): `admin / admin123`, `cocina / cocina123`.

## Notas
- El token JWT se guarda en `localStorage`; un 401 con sesión activa cierra la sesión.
- Las imágenes de productos se copiaron del sistema original a `public/img/`.
- Pendiente respecto al original: empleados/clientes, combos, tarjetas/pago real, subida de imágenes.
