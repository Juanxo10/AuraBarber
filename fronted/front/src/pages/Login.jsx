import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

   
      localStorage.setItem("token", res.data.token);
      if (res.data.id) {
        localStorage.setItem("user_id", res.data.id);
      }
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }
      if (res.data.nombre) {
        localStorage.setItem("nombre", res.data.nombre);
      }

     
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <>
      <style>{`
        html, body, #root { height: 100%; }
        body { margin: 0; background: linear-gradient(135deg,#0f172a,#1e293b); color: #f8f5f0; }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
        <div style={{ width: 380, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 16, padding: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f8f5f0" }}>Bienvenido</div>
            <div style={{ color: "#cbd5e1" }}>Ingresa para gestionar tus citas</div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
            />
            <button type="submit" style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "#d4af37", color: "#1b1b1b", fontWeight: 700 }}>Ingresar</button>
          </form>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#cbd5e1" }}>¿No tienes cuenta?</span>
            <button onClick={() => navigate('/register')} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #d4af37", background: "transparent", color: "#d4af37" }}>Registrar</button>
          </div>
        </div>
      </div>
    </>
  );
}
