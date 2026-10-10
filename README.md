# CubiSmart API

API prototipo del sistema de gestión de cubículos de biblioteca universitaria (Ingeniería de Software II, UGB).

## Cómo ejecutarla

1. Instalar Node.js
2. `npm install`
3. `npm start`
4. Abrir http://localhost:3000/api/health

## Usuarios de prueba

- estudiante / 1234
- admin / admin123

## Endpoints

- GET /api/health
- POST /api/auth/login
- GET /api/cubiculos, GET /api/cubiculos/:id
- GET, POST /api/reservas (requiere token)
- GET, PUT, DELETE /api/reservas/:id (requiere token)
- GET /api/reportes (requiere token)