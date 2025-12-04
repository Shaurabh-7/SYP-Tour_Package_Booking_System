import Sequelize from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ?
      { rejectUnauthorized: true } : false
    }
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL with Sequelize');
    
  } catch (err) {
    console.error('Connection Error:', err);
  }
}

testConnection();
export default sequelize;