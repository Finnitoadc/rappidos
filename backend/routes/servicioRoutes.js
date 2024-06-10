// servicioRoutes.js
import multer from 'multer';
import path from 'path';
import { Router } from 'express';
import {
  getAllServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
  countPedidosEnProgreso,
  countPedidosCompletados,
  countPedidosPorMes,
  getServiciosByMensajeroId,
  pedidosSolicitados,
  uploadImage
} from '../controllers/servicioController.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'fotos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), uploadImage);
router.get('/cuentas/en-progreso', countPedidosEnProgreso);
router.get('/cuentas/completados', countPedidosCompletados);
router.get('/cuentas/:year/:month', countPedidosPorMes);
router.get('/mensajeros/:mensajeroId', getServiciosByMensajeroId);
router.get('/solicitados', pedidosSolicitados);

// Luego define las rutas con parámetros
router.get('/:id', getServicioById);

// Finalmente, define las rutas más generales
router.get('/', getAllServicios);
router.post('/', createServicio);
router.put('/:id', updateServicio);
router.delete('/:id', deleteServicio);

export default router;