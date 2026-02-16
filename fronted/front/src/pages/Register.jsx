import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      return alert("La contraseña debe tener mínimo 6 caracteres");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    try {
      const regRes = await axios.post("http://localhost:5000/api/auth/register", {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
      });

      const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.token);
      if (loginRes.data.id) {
        localStorage.setItem("user_id", loginRes.data.id);
      } else if (regRes.data?.id) {
        localStorage.setItem("user_id", regRes.data.id);
      }
      if (loginRes.data.role) {
        localStorage.setItem("role", loginRes.data.role);
      }
      if (loginRes.data.nombre) {
        localStorage.setItem("nombre", loginRes.data.nombre);
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <>
      <style>{`
        html, body, #root { height: 100%; }
        body { margin: 0; background: linear-gradient(135deg,#0f172a,#1e293b); color: #f8f5f0; }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
        <div style={{ width: 420, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 16, padding: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f8f5f0" }}>Crea tu cuenta</div>
            <div style={{ color: "#cbd5e1" }}>Regístrate para agendar y gestionar tus citas</div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              onChange={handleChange}
              required
              style={{ padding: 12, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
            />
            <button type="submit" style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "#d4af37", color: "#1b1b1b", fontWeight: 700 }}>Crear cuenta</button>
          </form>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#cbd5e1" }}>¿Ya tienes cuenta?</span>
            <button onClick={() => navigate('/login')} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #d4af37", background: "transparent", color: "#d4af37" }}>Iniciar sesión</button>
          </div>
        </div>
      </div>
    </>
  );
}
