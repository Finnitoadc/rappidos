// routes/mensajeroRoutes.js
import { Router } from 'express';
import {
  getAllMensajeros,
  getMensajeroById,
  createMensajero,
  updateMensajero,
  deleteMensajero
} from '../controllers/mensajeroController.js';

const router = Router();

router.get('/', getAllMensajeros);
router.get('/:id', getMensajeroById);
router.post('/', createMensajero);
router.put('/:id', updateMensajero);
router.delete('/:id', deleteMensajero);

export default router;
