// models/mensajero.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Mensajero extends Model {
  static associate(models) {
    Mensajero.hasMany(models.Servicio, { foreignKey: 'mensajeroID' });
  }
}

Mensajero.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Mensajero',
});

export default Mensajero;
