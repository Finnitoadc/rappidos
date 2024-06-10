// routes/sucursalRoutes.js
import { Router } from 'express';
import {
  getAllSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal,
  getSucursalByClienteId
} from '../controllers/sucursalController.js';

const router = Router();

router.get('/', getAllSucursales);
router.get('/:id', getSucursalById);
router.get('/cliente/:clienteID', getSucursalByClienteId);
router.post('/', createSucursal);
router.put('/:id', updateSucursal);
router.delete('/:id', deleteSucursal);

export default router;
