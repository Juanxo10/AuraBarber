import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  
    if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 6%",
      background: "linear-gradient(135deg,#0f172a,#1e293b)",
      color: "#f8f5f0",
      borderBottom: "1px solid rgba(212,175,55,0.18)"
    }}>
      <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.4px" }}>
        BarberShop
      </span>

      <div style={{ display: "flex", gap: "16px" }}>
        <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", padding: "6px 10px", borderRadius: "8px" }}>
          Inicio
        </span>

        <span onClick={() => navigate("/agendar")} style={{ cursor: "pointer", padding: "6px 10px", borderRadius: "8px" }}>
          Agendar Cita
        </span>

        {role === "cliente" && (
          <span onClick={() => navigate("/historial")} style={{ cursor: "pointer", padding: "6px 10px", borderRadius: "8px" }}>
            Historial de cortes
          </span>
        )}

        {role === "admin" && (
          <span onClick={() => navigate("/panel-barbero")} style={{ cursor: "pointer", padding: "6px 10px", borderRadius: "8px" }}>
            Panel Barbero
          </span>
        )}

        <span
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_id");
            localStorage.removeItem("nombre");
            navigate("/");
          }}
          style={{ cursor: "pointer", color: "#d4af37", padding: "6px 10px", borderRadius: "8px", border: "1px solid #d4af37" }}
        >
          Salir
        </span>
      </div>
    </nav>
  );
}
