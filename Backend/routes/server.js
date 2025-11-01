// server.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; 

const app = express();

// ======= MIDDLEWARES =======
app.use(cors());           
app.use(express.json());   

// ======= RUTAS PRINCIPALES =======
app.use("/api", authRoutes);

// ======= PUERTO DEL SERVIDOR =======
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
