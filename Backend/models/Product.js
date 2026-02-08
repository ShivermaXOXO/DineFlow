const {  DataTypes  } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
     imageUrl: {  // Changed from imageUrl to image
        type: DataTypes.STRING,
        allowNull: false,  // Changed to false to match frontend requirement
        validate: {
            notEmpty: true
        }
    }

});

module.exports = Product;