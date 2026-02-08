require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Sequelize } = require('sequelize');

// Use individual parameters - this works reliably
const sequelize = new Sequelize(
  process.env.DB_NAME,      // database
  process.env.DB_USER,      // username
  process.env.DB_PASSWORD,  // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // FIXED CONFIGURATION:
    define: {
      freezeTableName: false,    // Use exact table names
      underscored: false,       // Keep as false
      timestamps: true,         // Enable timestamps
      createdAt: 'createdat',   // Map to lowercase createdat
      updatedAt: 'updatedat',   // Map to lowercase updatedat
    },
    quoteIdentifiers: false,    // Prevents Sequelize from adding quotes
    logging: process.env.NODE_ENV === 'development',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// ADD FIELD NAME FIXING HOOK FOR RAW QUERIES
sequelize.addHook('afterFind', (results, options) => {
  if (!results) return;
  
  const fixFieldNames = (item) => {
    if (item && typeof item === 'object') {
      // Map lowercase fields to camelCase for consistency (especially for raw: true queries)
      if (item.hasOwnProperty('createdat') && !item.hasOwnProperty('createdAt')) {
        item.createdAt = item.createdat;
      }
      if (item.hasOwnProperty('updatedat') && !item.hasOwnProperty('updatedAt')) {
        item.updatedAt = item.updatedat;
      }
      if (item.hasOwnProperty('totalcost') && !item.hasOwnProperty('totalCost')) {
        item.totalCost = item.totalcost;
      }
      if (item.hasOwnProperty('costperunit') && !item.hasOwnProperty('costPerUnit')) {
        item.costPerUnit = item.costperunit;
      }
      if (item.hasOwnProperty('hotelid') && !item.hasOwnProperty('hotelId')) {
        item.hotelId = item.hotelid;
      }
      if (item.hasOwnProperty('itemname') && !item.hasOwnProperty('itemName')) {
        item.itemName = item.itemname;
      }
      // ✅ FIX BILL TOTAL (MOST IMPORTANT)
      if (item.hasOwnProperty('total')) {
        item.total = Number(item.total);
      }

      if (item.hasOwnProperty('paymenttype') && !item.hasOwnProperty('paymentType')) {
        item.paymentType = item.paymenttype;
      }
      if (item.hasOwnProperty('diningtype') && !item.hasOwnProperty('diningType')) {
        item.diningType = item.diningtype;
      }

      if (item.hasOwnProperty('tablenumber') && !item.hasOwnProperty('tableNumber')) {
        item.tableNumber = item.tablenumber;
      }
      // ✅ FIX PHONE NUMBER
      if (item.hasOwnProperty('phonenumber') && !item.hasOwnProperty('phoneNumber')) {
        item.phoneNumber = item.phonenumber;
      }

      // ✅ FIX CUSTOMER NAME (safety)
      if (item.hasOwnProperty('customername') && !item.hasOwnProperty('customerName')) {
        item.customerName = item.customername;
      }

      // Handle invalid dates
      Object.keys(item).forEach(key => {
        if (item[key] instanceof Date && isNaN(item[key].getTime())) {
          item[key] = null;
        }
      });
    }
  };
  
  if (Array.isArray(results)) {
    results.forEach(fixFieldNames);
  } else {
    fixFieldNames(results);
  }
});

// ADD HOOK TO FIX BOOLEAN/SMALLINT ISSUE FOR REPEATCUSTOMERS
sequelize.beforeQuery((options, query) => {
  if (query && query.query) {
    let sql = query.query;
    
    // Fix isActive boolean issue for RepeatCustomers
    if (sql.includes('isActive') && (sql.includes('true') || sql.includes('false'))) {
      sql = sql.replace(/isActive\s*=\s*true/g, 'isactive = 1');
      sql = sql.replace(/isActive\s*=\s*false/g, 'isactive = 0');
    }
    
    query.query = sql;
  }
  return options;
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to PostgreSQL:', err);
  });

module.exports = sequelize;
