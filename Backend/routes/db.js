// db.js
import sql from "mssql";

const dbSettings = {
  user: "sa",
  password: "azul",
  server: "YOGA",      
  port: 1433,         
  database: "lab8db",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export async function getConnection() {
  try {
    const pool = await sql.connect(dbSettings);
    console.log("✅ Conectado a SQL Server correctamente");
    return pool;
  } catch (err) {
    console.error("❌ Error al conectar con SQL Server:", err);
  }
}
