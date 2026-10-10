# CubiSmart API

API prototipo del sistema de gestión de cubículos de biblioteca universitaria **CubiSmart**. Se usa como aplicación base para las pruebas de la actividad *Bloque 3 - Creación y Gestión de Pruebas* de Ingeniería de Software II (Universidad Gerardo Barrios, equipo NET MASTERS).

Es un prototipo mínimo: los datos viven **en memoria** (no hay base de datos), por lo que al reiniciar la app todo vuelve al estado inicial.

## Requisitos

- [Node.js](https://nodejs.org) (probado con v24)
- [Git](https://git-scm.com)

## Instalación y ejecución

```
git clone https://github.com/Sosagz09/cubismart-api.git
cd cubismart-api
npm install
npm start
```

Debe aparecer: `CubiSmart API corriendo en http://localhost:3000`

Para comprobar que funciona, abre en el navegador: http://localhost:3000/api/health

Para detener la app presiona `Ctrl + C` en la terminal.

## Usuarios de prueba

| Usuario | Clave | Rol |
|---|---|---|
| estudiante | 1234 | estudiante |
| admin | admin123 | admin |

## Cómo autenticarse

1. Hacer `POST /api/auth/login` con este cuerpo JSON:

```json
{ "usuario": "estudiante", "clave": "1234" }
```

2. La respuesta trae un token:

```json
{ "token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "rol": "estudiante" }
```

3. En las rutas protegidas, enviar el header:

```
Authorization: Bearer EL_TOKEN
```

Los tokens se pierden al reiniciar la app, así que hay que volver a hacer login.

## Endpoints

| Método | Ruta | Requiere token | Respuestas |
|---|---|---|---|
| GET | `/api/health` | No | 200 |
| POST | `/api/auth/login` | No | 200, 401 (credenciales incorrectas) |
| GET | `/api/cubiculos` | No | 200 |
| GET | `/api/cubiculos/:id` | No | 200, 404 |
| GET | `/api/reservas` | Sí | 200, 401 |
| GET | `/api/reservas/:id` | Sí | 200, 401, 404 |
| POST | `/api/reservas` | Sí | 201, 400 (faltan campos), 401, 404 (cubículo no existe) |
| PUT | `/api/reservas/:id` | Sí | 200, 401, 404 |
| DELETE | `/api/reservas/:id` | Sí | 200, 401, 404 |
| GET | `/api/reportes` | Sí | 200, 401 |

Cualquier otra ruta responde 404.

## Ejemplo: crear una reserva

`POST /api/reservas` con el token en el header y este cuerpo:

```json
{
  "cubiculoId": 2,
  "usuario": "estudiante",
  "fecha": "2026-10-20",
  "horaInicio": "14:00",
  "horaFin": "16:00"
}
```

Responde 201 con la reserva creada y su `id`.

## Datos iniciales

- 5 cubículos (ids 1 a 5): A1, A2, B1, B2 y C1
- 1 reserva de ejemplo (id 1)

## Notas para las pruebas

- La app corre en el puerto **3000**.
- Cada integrante debe correr la API en su **propia computadora** y probar contra `localhost`. No se hacen pruebas de carga contra equipos de otras personas ni contra sitios públicos.
- Para repetir una prueba desde cero, reiniciar la app (`Ctrl + C` y `npm start`).
- Las pruebas de carga con JMeter y Gatling deben incluir primero el login y reutilizar el token.

## Distribución del trabajo

| Ejercicio | Responsable |
|---|---|
| Aplicación prototipo y Postman | Daniel|
| JMeter | Anderson |
| Plan de pruebas y Azure DevOps | Dayana |
| Gatling e informe final | Juan José |