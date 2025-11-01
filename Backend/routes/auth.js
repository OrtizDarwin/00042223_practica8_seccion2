// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "../db.js";

const router = express.Router();
const JWT_SECRET = "pruebaxd"; 

//  REGISTRO DE USUARIO
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const pool = await getConnection();

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("username", username)
      .input("email", email)
      .input("password", hashedPassword)
      .query(
        "INSERT INTO users (username, email, password) VALUES (@username, @email, @password)"
      );

    res.status(200).json({ message: "✅ Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
});

//  LOGIN DE USUARIO
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM users WHERE email = @email");

    const user = result.recordset[0];
    if (!user)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

//  RUTA PROTEGIDA (requiere token)
router.get("/protected", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({
      message: "Acceso autorizado",
      user: decoded
    });
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
});

export default router;
