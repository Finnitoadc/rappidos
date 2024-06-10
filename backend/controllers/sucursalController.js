// controllers/sucursalController.js
import Sucursal from '../models/Sucursal.js';
import Sequelize from '../config/database.js';

export const getAllSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.findAll();
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener los servicios correspondientes a un mensajero
export const getSucursalByClienteId = async (req, res) => {
  try {
    const { clienteID } = req.params;

    if (!clienteID) {
      return res.status(400).json({ error: 'El clienteID es requerido' });
    }

    const servicios = await Sequelize.query(
      `SELECT * FROM "Sucursals" WHERE "clienteID" = :clienteID`,
      {
        replacements: { clienteID },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSucursalById = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByPk(req.params.id);
    if (sucursal) {
      res.json(sucursal);
    } else {
      res.status(404).json({ error: 'Sucursal no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSucursal = async (req, res) => {
  try {
    const sucursal = await Sucursal.create(req.body);
    res.status(201).json(sucursal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSucursal = async (req, res) => {
  try {
    const [updated] = await Sucursal.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSucursal = await Sucursal.findByPk(req.params.id);
      res.json(updatedSucursal);
    } else {
      res.status(404).json({ error: 'Sucursal no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSucursal = async (req, res) => {
  try {
    const deleted = await Sucursal.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Sucursal no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
