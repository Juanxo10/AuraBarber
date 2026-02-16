const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const loginRoutes = require("./routes/loginRoutes");
const reservasRoutes = require("./routes/reservasRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/auth", loginRoutes);

app.use("/api/reservas", reservasRoutes);

module.exports = app;
