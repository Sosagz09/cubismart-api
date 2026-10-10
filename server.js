const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());

// ---------- Datos en memoria ----------
const usuarios = [
  { usuario: 'estudiante', clave: '1234', rol: 'estudiante' },
  { usuario: 'admin', clave: 'admin123', rol: 'admin' },
];

const cubiculos = [
  { id: 1, nombre: 'Cubículo A1', capacidad: 4, piso: 1 },
  { id: 2, nombre: 'Cubículo A2', capacidad: 4, piso: 1 },
  { id: 3, nombre: 'Cubículo B1', capacidad: 6, piso: 2 },
  { id: 4, nombre: 'Cubículo B2', capacidad: 6, piso: 2 },
  { id: 5, nombre: 'Cubículo C1', capacidad: 8, piso: 3 },
];

let reservas = [
  {
    id: 1,
    cubiculoId: 1,
    usuario: 'estudiante',
    fecha: '2026-10-15',
    horaInicio: '09:00',
    horaFin: '11:00',
  },
];
let siguienteId = 2;

const tokens = new Set();

// ---------- Middleware de autenticación ----------
function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Token inválido o ausente' });
  }
  next();
}

// ---------- Salud ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({ estado: 'ok', app: 'CubiSmart API' });
});

// ---------- Autenticación ----------
app.post('/api/auth/login', (req, res) => {
  const { usuario, clave } = req.body || {};
  const encontrado = usuarios.find(
    (u) => u.usuario === usuario && u.clave === clave
  );
  if (!encontrado) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = crypto.randomUUID();
  tokens.add(token);
  res.status(200).json({ token, rol: encontrado.rol });
});

// ---------- Cubículos ----------
app.get('/api/cubiculos', (req, res) => {
  res.status(200).json(cubiculos);
});

app.get('/api/cubiculos/:id', (req, res) => {
  const cubiculo = cubiculos.find((c) => c.id === Number(req.params.id));
  if (!cubiculo) {
    return res.status(404).json({ error: 'Cubículo no encontrado' });
  }
  res.status(200).json(cubiculo);
});

// ---------- Reservas (requieren token) ----------
app.get('/api/reservas', autenticar, (req, res) => {
  res.status(200).json(reservas);
});

app.get('/api/reservas/:id', autenticar, (req, res) => {
  const reserva = reservas.find((r) => r.id === Number(req.params.id));
  if (!reserva) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  res.status(200).json(reserva);
});

app.post('/api/reservas', autenticar, (req, res) => {
  const { cubiculoId, usuario, fecha, horaInicio, horaFin } = req.body || {};
  if (!cubiculoId || !usuario || !fecha || !horaInicio || !horaFin) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (!cubiculos.some((c) => c.id === Number(cubiculoId))) {
    return res.status(404).json({ error: 'Cubículo no encontrado' });
  }
  const nueva = {
    id: siguienteId++,
    cubiculoId: Number(cubiculoId),
    usuario,
    fecha,
    horaInicio,
    horaFin,
  };
  reservas.push(nueva);
  res.status(201).json(nueva);
});

app.put('/api/reservas/:id', autenticar, (req, res) => {
  const reserva = reservas.find((r) => r.id === Number(req.params.id));
  if (!reserva) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  const { cubiculoId, usuario, fecha, horaInicio, horaFin } = req.body || {};
  if (cubiculoId !== undefined) {
    if (!cubiculos.some((c) => c.id === Number(cubiculoId))) {
      return res.status(404).json({ error: 'Cubículo no encontrado' });
    }
    reserva.cubiculoId = Number(cubiculoId);
  }
  if (usuario !== undefined) reserva.usuario = usuario;
  if (fecha !== undefined) reserva.fecha = fecha;
  if (horaInicio !== undefined) reserva.horaInicio = horaInicio;
  if (horaFin !== undefined) reserva.horaFin = horaFin;
  res.status(200).json(reserva);
});

app.delete('/api/reservas/:id', autenticar, (req, res) => {
  const indice = reservas.findIndex((r) => r.id === Number(req.params.id));
  if (indice === -1) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  reservas.splice(indice, 1);
  res.status(200).json({ mensaje: 'Reserva eliminada' });
});

// ---------- Reportes (requieren token) ----------
app.get('/api/reportes', autenticar, (req, res) => {
  const porCubiculo = cubiculos.map((c) => ({
    cubiculoId: c.id,
    nombre: c.nombre,
    totalReservas: reservas.filter((r) => r.cubiculoId === c.id).length,
  }));
  res.status(200).json({
    totalCubiculos: cubiculos.length,
    totalReservas: reservas.length,
    porCubiculo,
  });
});

// ---------- Ruta no encontrada ----------
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`CubiSmart API corriendo en http://localhost:${PORT}`);
});