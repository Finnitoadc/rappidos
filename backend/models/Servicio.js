// models/servicio.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Servicio extends Model {
  static associate(models) {
    Servicio.belongsTo(models.Usuario, { foreignKey: 'usuarioID' });
    Servicio.belongsTo(models.Mensajero, { foreignKey: 'mensajeroID' });
    Servicio.hasMany(models.EstadoServicio, { foreignKey: 'servicioID' });
  }
}

Servicio.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuarioID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mensajeroID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipo_transporte: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  numero_paquetes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  origen: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  destino: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fotoURL: { 
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Servicio',
});

export default Servicio;
