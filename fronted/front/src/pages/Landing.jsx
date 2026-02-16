import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const images = (Array.isArray(window.LANDING_IMAGES) && window.LANDING_IMAGES.length
    ? window.LANDING_IMAGES
    : ["/src/assets/landing/1.jpg", "/src/assets/landing/2.jpg", "/src/assets/landing/3.jpg"]);
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        html, body, #root { height: 100%; }
        body { margin: 0; background: linear-gradient(135deg,#0f172a,#1e293b); color: #f8f5f0; }
      `}</style>
      <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", width: "100vw", color: "#f8f5f0", overflowX: "hidden" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 6%", color: "#f8f5f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, letterSpacing: "0.5px" }}>
          <span style={{ fontSize: "1.6rem" }}>BarberShop</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/login")} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #d4af37", background: "transparent", color: "#d4af37" }}>Iniciar sesión</button>
          <button onClick={() => navigate("/register")} style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#d4af37", color: "#1b1b1b", fontWeight: 600 }}>Registrarse</button>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", padding: "60px 8%", maxWidth: "1400px", margin: "0 auto" }}>
        <div>
          <h1 style={{ fontSize: "3rem", lineHeight: 1.1, color: "#f8f5f0" }}>Reserva tu cita en segundos</h1>
          <p style={{ marginTop: "14px", color: "#cbd5e1", maxWidth: "560px" }}>Estilo impecable, puntualidad y atención profesional. Agenda tu corte con una experiencia moderna y confiable.</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button onClick={() => navigate("/register")} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", background: "#d4af37", color: "#1b1b1b", fontWeight: 700 }}>Reservar cita</button>
          </div>
        </div>
        <div style={{ position: "relative", height: "480px", borderRadius: "18px", overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,0.45)", border: "1px solid rgba(212,175,55,0.35)" }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${images[idx]})`,
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.55))" }} />
          <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: "6px" }}>
            {images.map((_, i) => (
              <span key={i} onClick={() => setIdx(i)} style={{ width: 10, height: 10, borderRadius: "50%", border: "1px solid #f8f5f0", background: i === idx ? "#d4af37" : "transparent", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "20px 8% 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "1.1rem", color: "#f8f5f0", marginBottom: "6px" }}>Corte clásico</div>
            <div style={{ color: "#d4af37" }}>$25.000</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "1.1rem", color: "#f8f5f0", marginBottom: "6px" }}>Corte + barba</div>
            <div style={{ color: "#d4af37" }}>$40.000</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ fontSize: "1.1rem", color: "#f8f5f0", marginBottom: "6px" }}>Solo barba</div>
            <div style={{ color: "#d4af37" }}>$20.000</div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
