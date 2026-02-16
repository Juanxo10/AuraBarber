const pool = require("../config/db");

const HORARIOS_BASE = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00"
];



exports.getHorarios = async (req, res) => {
  const { fecha } = req.params;

  try {
    const result = await pool.query(
      "SELECT hora FROM reservas WHERE fecha = $1",
      [fecha]
    );

    const ocupadas = result.rows.map(r => r.hora);

    const horarios = HORARIOS_BASE.map(hora => ({
      hora,
      ocupado: ocupadas.includes(hora)
    }));

    res.json(horarios);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};


exports.crearReserva = async (req, res) => {
  const { fecha, hora, servicio } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const ahora = new Date();
  const fechaHora = new Date(`${fecha}T${hora}:00`);
  if (Number.isNaN(fechaHora.getTime())) {
    return res.status(400).json({ message: "Fecha u hora inválida" });
  }
  const currentYear = ahora.getFullYear();
  const maxYear = currentYear + 2;
  const year = fechaHora.getFullYear();
  if (year < currentYear || year > maxYear) {
    return res.status(400).json({ message: `Solo se puede agendar entre ${currentYear} y ${maxYear}` });
  }
  const minAnticipacionMs = 60 * 60 * 1000;
  if (fechaHora.getTime() - ahora.getTime() < minAnticipacionMs) {
    return res.status(400).json({ message: "Debes reservar con al menos 1 hora de anticipación" });
  }
  if (fechaHora.getDay() === 0) {
    return res.status(400).json({ message: "Domingos no disponibles" });
  }

  try {
    const delDia = await pool.query(
      "SELECT COUNT(*) FROM reservas WHERE user_id = $1 AND fecha = $2 AND estado = 'Confirmada'",
      [user_id, fecha]
    );
    if (Number(delDia.rows[0].count) >= 1) {
      return res.status(400).json({ message: " Ya tienes una reserva activa ese día" });
    }

    const existe = await pool.query(
      "SELECT * FROM reservas WHERE fecha = $1 AND hora = $2 AND estado = 'Confirmada'",
      [fecha, hora]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ message: " Hora ocupada" });
    }

    await pool.query(
      "INSERT INTO reservas (user_id, fecha, hora, servicio, estado, created_at) VALUES ($1, $2, $3, $4, 'Confirmada', NOW())",
      [user_id, fecha, hora, servicio]
    );

    res.json({ message: " Reserva creada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};




exports.getMisReservas = async (req, res) => {
  const user_id = req.params.user_id || req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM reservas WHERE user_id = $1 ORDER BY fecha ASC, hora ASC",
      [user_id]
    );

    const ahora = new Date();

    const reservas = result.rows.map(r => {
      const fechaHora = new Date(`${r.fecha}T${r.hora}:00`);
      const diffHoras = (fechaHora - ahora) / (1000 * 60 * 60);

      return {
        ...r,
        puede_cancelar: diffHoras > 2
      };
    });

    res.json(reservas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};



exports.cancelarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await pool.query(
      "SELECT * FROM reservas WHERE id = $1",
      [id]
    );

    if (reserva.rows.length === 0) {
      return res.status(404).json({ error: "No existe reserva" });
    }

    const r = reserva.rows[0];
    const fechaHora = new Date(`${r.fecha}T${r.hora}:00`);
    const diffHoras = (fechaHora - new Date()) / (1000 * 60 * 60);

    if (diffHoras <= 2) {
      return res.status(400).json({
        message: "❌ No se puede cancelar con menos de 2 horas"
      });
    }

    await pool.query(
      "UPDATE reservas SET estado = 'Cancelada' WHERE id = $1",
      [id]
    );

    res.json({ message: "✅ Reserva cancelada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};

exports.getAgendaDia = async (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().slice(0, 10);
    const result = await pool.query(
      "SELECT r.id, r.fecha, r.hora, r.servicio, r.estado, u.nombre FROM reservas r JOIN users u ON u.id = r.user_id WHERE r.fecha = $1 ORDER BY r.hora ASC",
      [fecha]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};

exports.getAgendaSemana = async (req, res) => {
  try {
    const base = req.query.fecha ? new Date(`${req.query.fecha}T00:00:00`) : new Date();
    const day = base.getDay();
    const diffMonday = (day + 6) % 7;
    const monday = new Date(base);
    monday.setDate(base.getDate() - diffMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const desde = req.query.desde || monday.toISOString().slice(0, 10);
    const hasta = req.query.hasta || sunday.toISOString().slice(0, 10);
    const result = await pool.query(
      "SELECT r.id, r.fecha, r.hora, r.servicio, r.estado, u.nombre FROM reservas r JOIN users u ON u.id = r.user_id WHERE r.fecha BETWEEN $1 AND $2 ORDER BY r.fecha ASC, r.hora ASC",
      [desde, hasta]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};

