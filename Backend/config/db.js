require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const isCloud = databaseUrl.includes("supabase.co") || databaseUrl.includes("neon.tech");

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: isCloud
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      }
    : {},
});

sequelize.authenticate()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ DB Error:', err));

module.exports = sequelize;