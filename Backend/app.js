// app.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js"; 
import { getConnection } from "./db.js"; 

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret";

// ====== MIDDLEWARES ======
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ====== RUTAS PRINCIPALES ======
app.use("/api", authRoutes);

// ====== PROBAR CONEXION A SQL SERVER AL INICIAR ======
(async () => {
  try {
    const pool = await getConnection();
    if (pool) {
      console.log("✅ Conexión inicial exitosa a SQL Server");
    } else {
      console.log("❌ No se pudo establecer la conexión inicial a SQL Server");
    }
  } catch (error) {
    console.error("❌ Error durante la conexión inicial:", error);
  }
})();

// ====== MIDDLEWARE PARA VERIFICAR TOKEN  ======
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ====== RUTA DE PRUEBA PROTEGIDA ======
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
});

// ====== INICIAR SERVIDOR ======
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
