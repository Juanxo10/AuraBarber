import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Navbar from "./Navbar";
import Agendar from "./pages/Agendar";
import MisReservas from "./pages/MisReservas";
import BarberPanel from "./pages/BarberPanel";
import Historial from "./pages/Historial";

const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    return null;
  }
  return children;
};

const RequireCliente = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role !== "cliente") {
    return null;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agendar" element={<Agendar />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/historial" element={<RequireCliente><Historial /></RequireCliente>} />
        <Route path="/panel-barbero" element={<RequireAdmin><BarberPanel /></RequireAdmin>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;