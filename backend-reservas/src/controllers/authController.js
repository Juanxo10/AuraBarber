const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener mínimo 6 caracteres",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const inserted = await pool.query(
      "INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre",
      [nombre, email, hashedPassword]
    );
    const user = inserted.rows[0];
    res.status(201).json({ message: "Usuario registrado correctamente", id: user.id, nombre: user.nombre });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
