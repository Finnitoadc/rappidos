import Cliente from '../models/Cliente.js';
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

export const getAllClientes = async (req, res) => {
  try {
    const result = await sequelize.query('SELECT * FROM "Clientes"', {
      type: QueryTypes.SELECT
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const cliente = await sequelize.query('SELECT * FROM "Clientes" WHERE "ID_cliente" = :id', {
      type: QueryTypes.SELECT,
      replacements: { id: req.params.id }
    });

    if (cliente.length > 0) {
      res.json(cliente[0]);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, email, telefono } = req.body;
    const result = await sequelize.query(
      'INSERT INTO "Clientes" (nombre, direccion, ciudad, email, telefono, "createdAt", "updatedAt") VALUES (:nombre, :direccion, :ciudad, :email, :telefono, NOW(), NOW()) RETURNING *',
      {
        type: QueryTypes.INSERT,
        replacements: { nombre, direccion, ciudad, email, telefono }
      }
    );
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, email, telefono } = req.body;
    const result = await sequelize.query(
      'UPDATE "Clientes" SET nombre = :nombre, direccion = :direccion, ciudad = :ciudad, email = :email, telefono = :telefono, "updatedAt" = NOW() WHERE "ID_cliente" = :id RETURNING *',
      {
        type: QueryTypes.UPDATE,
        replacements: { nombre, direccion, ciudad, email, telefono, id: req.params.id }
      }
    );

    if (result[1] > 0) {
      res.json(result[0][0]);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const deleteCliente = async (req, res) => {
  try {
    const result = await sequelize.query(
      'DELETE FROM "Clientes" WHERE "ID_cliente" = :id',
      {
        type: QueryTypes.DELETE,
        replacements: { id: req.params.id }
      }
    );

    if (result[1] > 0) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
