// models/Bill.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bill = sequelize.define('Bill', {
  customername: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'customername',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phonenumber',
  },
  tableNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tablenumber',
  },
  diningType: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['dine-in', 'takeaway']]
    }
  },
  carDetails: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'total'

  },
  paymentType: {
    type: DataTypes.ENUM('cash', 'upi', 'creditCard'),
    defaultValue: 'cash',
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// Export the model and an `associate` function
Bill.associate = (models) => {
  Bill.belongsTo(models.Staff, { foreignKey: 'staffId', as: 'staff' });
};

module.exports = Bill;
