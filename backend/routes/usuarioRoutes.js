// routes/usuarioRoutes.js
import { Router } from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosByClienteID,
  authenticateUsuario
} from '../controllers/usuarioController.js';

const router = Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);
router.get('/cliente/:clienteID', getUsuariosByClienteID);
router.post('/auth', authenticateUsuario);

export default router;
