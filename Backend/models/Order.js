const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  customername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tableNumber: {
    type: DataTypes.STRING,
    allowNull: true,
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
    defaultValue: [],
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'ready', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Assigned when staff accepts the order
  },
  acceptedat: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedat: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

// Define associations
Order.associate = (models) => {
  if (models.Staff) {
    Order.belongsTo(models.Staff, { foreignKey: 'staffId', as: 'assignedStaff' });
  }
  if (models.Hotels) {
    Order.belongsTo(models.Hotels, { foreignKey: 'hotelId' });
  }
};

module.exports = Order;
