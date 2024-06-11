// controllers/usuarioController.js
import sequelize from '../config/database.js';

export const getAllUsuarios = async (req, res) => {
  try {
    const [usuarios] = await sequelize.query('SELECT * FROM "Usuarios"');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const [usuario] = await sequelize.query('SELECT * FROM "Usuarios" WHERE "id" = :id', {
      replacements: { id: req.params.id }
    });
    if (usuario.length > 0) {
      res.json(usuario[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { clienteID, login, contrasena, direccion, email, telefono } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();
    await sequelize.query(
      `INSERT INTO "Usuarios" ("clienteID", "login", "contrasena", "direccion", "email", "telefono", "createdAt", "updatedAt") VALUES (:clienteID, :login, :contrasena, :direccion, :email, :telefono, :createdAt, :updatedAt)`,
      {
        replacements: { clienteID, login, contrasena, direccion, email, telefono, createdAt, updatedAt }
      }
    );
    const [usuario] = await sequelize.query('SELECT * FROM "Usuarios" WHERE "id" = (SELECT MAX("id") FROM "Usuarios")');
    res.status(201).json(usuario[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { clienteID, login, contrasena, direccion, email, telefono } = req.body;
    const updatedAt = new Date();
    const [result] = await sequelize.query(
      `UPDATE "Usuarios" SET "clienteID" = :clienteID, "login" = :login, "contrasena" = :contrasena, "direccion" = :direccion, "email" = :email, "telefono" = :telefono, "updatedAt" = :updatedAt WHERE "id" = :id`,
      {
        replacements: { id: req.params.id, clienteID, login, contrasena, direccion, email, telefono, updatedAt }
      }
    );
    if (result.rowCount > 0) {
      const [usuario] = await sequelize.query('SELECT * FROM "Usuarios" WHERE "id" = :id', {
        replacements: { id: req.params.id }
      });
      res.json(usuario[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const [result] = await sequelize.query('DELETE FROM "Usuarios" WHERE "id" = :id', {
      replacements: { id: req.params.id }
    });
    if (result.rowCount > 0) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsuariosByClienteID = async (req, res) => {
  try {
    const [usuarios] = await sequelize.query('SELECT * FROM "Usuarios" WHERE "clienteID" = :clienteID', {
      replacements: { clienteID: req.params.clienteID }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const authenticateUsuario = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const [usuario] = await sequelize.query('SELECT * FROM "Usuarios" WHERE "email" = :email AND "contrasena" = :contrasena', {
      replacements: { email, contrasena }
    });

    if (usuario.length > 0) {
      const [cliente] = await sequelize.query('SELECT * FROM "Clientes" WHERE "ID_cliente" = :clienteID', {
        replacements: { clienteID: usuario[0].clienteID }
      });

      if (cliente.length > 0) {
        res.json({ 
          message: 'Login successful', 
          user: { 
            id: usuario[0].id, 
            email: usuario[0].email, 
            clienteID: cliente[0].ID_cliente 
          } 
        });
      } else {
        res.status(404).json({ error: 'Cliente no encontrado' });
      }
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

