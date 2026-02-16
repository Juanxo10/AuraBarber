const express = require("express");
const router = express.Router();
const reservasController = require("../controllers/reservasController");
const auth = require("../middleware/authMiddleware");
const allowRole = require("../middleware/roleMiddleware");

router.get("/horarios/:fecha", reservasController.getHorarios);
router.post("/reservar", auth, reservasController.crearReserva);
router.get("/mis-reservas", auth, reservasController.getMisReservas);
router.get("/mis-reservas/:user_id", reservasController.getMisReservas);
router.get("/agenda/dia", auth, allowRole("admin"), reservasController.getAgendaDia);
router.get("/agenda/semana", auth, allowRole("admin"), reservasController.getAgendaSemana);
router.put("/cancelar/:id", reservasController.cancelarReserva);

module.exports = router;
