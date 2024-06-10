// models/sucursal.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Sucursal extends Model {
  static associate(models) {
    Sucursal.belongsTo(models.Cliente, { foreignKey: 'clienteID' });
  }
}

Sucursal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Sucursal',
});

export default Sucursal;
