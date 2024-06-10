// models/usuario.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Usuario extends Model {
  static associate(models) {
    Usuario.belongsTo(models.Cliente, { foreignKey: 'clienteID' });
  }
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  login: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING(50),
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
  modelName: 'Usuario',
});

export default Usuario;
