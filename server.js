const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 5001;

// Configuración del servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Permitir conexión desde el frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let detections = [];

// Emitir detecciones a través de Socket.IO
app.post('/api/detections', (req, res) => {
  const { gender, age, timeInScreen } = req.body;
  if (gender && age !== undefined && timeInScreen !== undefined) {
    const newDetection = { gender, age, timeInScreen, timestamp: new Date() };
    detections.push(newDetection);

    // Emitir datos al frontend
    io.emit('new-detection', newDetection);

    return res.status(201).json({ message: 'Datos guardados exitosamente' });
  }
  res.status(400).json({ message: 'Datos inválidos' });
});

app.get('/api/detections', (req, res) => {
  res.json(detections);
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
