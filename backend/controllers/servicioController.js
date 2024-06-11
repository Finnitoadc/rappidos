import Servicio from '../models/Servicio.js';
import Sequelize from '../config/database.js';

// Obtener todos los servicios
export const getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un servicio por ID
export const getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (servicio) {
      res.json(servicio);
    } else {
      res.status(404).json({ error: 'Servicio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo servicio
export const createServicio = async (req, res) => {
  try {
    const { clienteID, usuarioID, mensajeroID, fecha_solicitud, tipo_transporte, numero_paquetes, estado, origen, destino, ciudad, descripcion, fotoURL } = req.body;

    const newServicio = await Servicio.create({
      clienteID,
      usuarioID,
      mensajeroID,
      fecha_solicitud,
      tipo_transporte,
      numero_paquetes,
      estado,
      origen,
      destino,
      ciudad,
      descripcion,
      fotoURL // Incluye este campo en la creación
    });

    res.status(201).json(newServicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un servicio existente
export const updateServicio = async (req, res) => {
  try {
    const { clienteID, usuarioID, mensajeroID, fecha_solicitud, tipo_transporte, numero_paquetes, estado, origen, destino, ciudad, descripcion, fotoURL } = req.body;

    const [updated] = await Servicio.update({
      clienteID,
      usuarioID,
      mensajeroID,
      fecha_solicitud,
      tipo_transporte,
      numero_paquetes,
      estado,
      origen,
      destino,
      ciudad,
      descripcion,
      fotoURL // Incluye este campo en la actualización
    }, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedServicio = await Servicio.findByPk(req.params.id);
      res.json(updatedServicio);
    } else {
      res.status(404).json({ error: 'Servicio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un servicio
export const deleteServicio = async (req, res) => {
  try {
    const deleted = await Servicio.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Servicio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contar los pedidos en progreso
export const countPedidosEnProgreso = async (req, res) => {
  try {
    const result = await Sequelize.query(
      'SELECT COUNT(*) AS count FROM "Servicios" WHERE estado = \'en progreso\'',
      { type: Sequelize.QueryTypes.SELECT }
    );
    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contar los pedidos completados
export const countPedidosCompletados = async (req, res) => {
  try {
    const result = await Sequelize.query(
      'SELECT COUNT(*) AS count FROM "Servicios" WHERE estado = \'completado\'',
      { type: Sequelize.QueryTypes.SELECT }
    );
    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contar los pedidos realizados durante un mes
export const countPedidosPorMes = async (req, res) => {
  const { year, month } = req.params;
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const result = await Sequelize.query(
      'SELECT COUNT(*) AS count FROM "Servicios" WHERE fecha_solicitud BETWEEN :startDate AND :endDate',
      {
        replacements: { startDate, endDate },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener los servicios correspondientes a un mensajero
export const getServiciosByMensajeroId = async (req, res) => {
  try {
    const { mensajeroId } = req.params;

    if (!mensajeroId) {
      return res.status(400).json({ error: 'El mensajeroId es requerido' });
    }

    const servicios = await Sequelize.query(
      `SELECT * FROM "Servicios" WHERE "mensajeroID" = :mensajeroId`,
      {
        replacements: { mensajeroId },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const pedidosSolicitados = async (req, res) => {
  try {
    const result = await Servicio.findAll({
      where: {
        estado: 'Solicitado'
      }
    });
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los pedidos solicitados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// servicioController.js
export const uploadImage = async (req, res) => {
  try {
    const { id } = req.body;
    const imageUrl = `/fotos/${req.file.filename}`;

    const updated = await Servicio.update({ fotoURL: imageUrl }, {
      where: { id }
    });

    if (updated) {
      const updatedServicio = await Servicio.findByPk(id);
      res.json(updatedServicio);
    } else {
      res.status(404).json({ error: 'Servicio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener los pedidos atendidos por mensajero en un mes especificado
export const getPedidosAtendidosPorMensajeroEnMes = async (req, res) => {
  const { mensajeroId, year, month } = req.params;
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const result = await Sequelize.query(
      `SELECT * FROM "Servicios" WHERE "mensajeroID" = :mensajeroId AND "fecha_solicitud" BETWEEN :startDate AND :endDate`,
      {
        replacements: { mensajeroId, startDate, endDate },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener los pedidos solicitados por cliente y por mes
export const getPedidosPorClienteyMes = async (req, res) => {
  const { clienteId, year, month } = req.params;
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const result = await Sequelize.query(
      `SELECT * FROM "Servicios" WHERE "clienteID" = :clienteId AND "fecha_solicitud" BETWEEN :startDate AND :endDate`,
      {
        replacements: { clienteId, startDate, endDate },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getPedidosPorMes = async (req, res) => {
  const { year, month } = req.params;
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const result = await Sequelize.query(
      `SELECT * FROM "Servicios" WHERE fecha_solicitud >= :startDate AND fecha_solicitud <= :endDate`,
      {
        replacements: { startDate, endDate },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPedidosAtendidosEnMes = async (req, res) => {
  const { year, month } = req.params;
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const result = await Sequelize.query(
      `SELECT * FROM "Servicios" WHERE "fecha_solicitud" >= :startDate AND fecha_solicitud <= :endDate`,
      {
        replacements: { startDate, endDate },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
