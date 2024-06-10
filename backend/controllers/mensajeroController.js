// controllers/mensajeroController.js
import Mensajero from '../models/Mensajero.js';

export const getAllMensajeros = async (req, res) => {
  try {
    const mensajeros = await Mensajero.findAll();
    res.json(mensajeros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMensajeroById = async (req, res) => {
  try {
    const mensajero = await Mensajero.findByPk(req.params.id);
    if (mensajero) {
      res.json(mensajero);
    } else {
      res.status(404).json({ error: 'Mensajero no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMensajero = async (req, res) => {
  try {
    const mensajero = await Mensajero.create(req.body);
    res.status(201).json(mensajero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMensajero = async (req, res) => {
  try {
    const [updated] = await Mensajero.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedMensajero = await Mensajero.findByPk(req.params.id);
      res.json(updatedMensajero);
    } else {
      res.status(404).json({ error: 'Mensajero no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMensajero = async (req, res) => {
  try {
    const deleted = await Mensajero.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Mensajero no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
