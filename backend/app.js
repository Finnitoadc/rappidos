import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath

import sequelize from './config/database.js';
import clienteRoutes from './routes/clienteRoutes.js';
import sucursalRoutes from './routes/sucursalRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import mensajeroRoutes from './routes/mensajeroRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta 'fotos'
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

// Rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mensajeros', mensajeroRoutes);
app.use('/api/servicios', servicioRoutes);

// Ruta para verificar la conexión a la base de datos
app.get('/healthy', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send('Connection to database has been established successfully.');
  } catch (error) {
    res.status(500).send('Unable to connect to the database: ' + error.message);
  }
});

const PORT = process.env.PORT || 5000;

// Sincronizar los modelos con la base de datos y luego iniciar el servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Unable to connect to the database:', err.message);
});
