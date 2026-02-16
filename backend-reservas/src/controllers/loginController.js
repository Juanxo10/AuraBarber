const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, id: user.id, role: user.role, nombre: user.nombre });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
