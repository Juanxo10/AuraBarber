const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  obtenerHorarios,
  crearReserva,
} = require("../controllers/reservaController");

router.get("/horarios", obtenerHorarios);
router.post("/", auth, crearReserva);

module.exports = router;
