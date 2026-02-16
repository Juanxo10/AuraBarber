import React, { useEffect, useState } from "react";

export default function DashboardUsuario() {
  const roleRaw = localStorage.getItem("role");
  const role = roleRaw ? roleRaw.toString().trim().toLowerCase() : "";
  const isAdmin = role === "admin";
  const [panelTitle, setPanelTitle] = useState(isAdmin ? "Panel de Administrador" : "Panel de Usuario");
  const [hoyCount, setHoyCount] = useState(0);
  const [primeraReservaText, setPrimeraReservaText] = useState("Sin reservas");
  const [proximaReservaText, setProximaReservaText] = useState("Sin reservas");
  const [imgIndex, setImgIndex] = useState(0);
  const adminImages = (Array.isArray(window.DASHBOARD_IMAGES_ADMIN) && window.DASHBOARD_IMAGES_ADMIN.length ? window.DASHBOARD_IMAGES_ADMIN : ["/src/assets/landing/1.jpg", "/src/assets/landing/2.jpg", "/src/assets/landing/3.jpg"]);
  const userImages = (Array.isArray(window.DASHBOARD_IMAGES_USER) && window.DASHBOARD_IMAGES_USER.length ? window.DASHBOARD_IMAGES_USER : ["/src/assets/landing/1.jpg", "/src/assets/landing/2.jpg", "/src/assets/landing/3.jpg"]);
  const images = isAdmin ? adminImages : userImages;  
  const toDateSafe = (fecha, hora) => {
    const h = String(hora || "").trim();
    const hhmm = /^\d{2}:\d{2}$/;
    const hhmmss = /^\d{2}:\d{2}:\d{2}$/;
    const t = hhmm.test(h) ? `${h}:00` : hhmmss.test(h) ? h : null;
    if (!t || !fecha) return null;
    const d = new Date(`${fecha}T${t}`);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setHoyCount(0);
      setPrimeraReservaText("No autenticado");
      setProximaReservaText("No autenticado");
      return;
    }

    if (isAdmin) {
      const hoy = new Date().toISOString().slice(0, 10);
      fetch(`http://localhost:5000/api/reservas/agenda/dia?fecha=${hoy}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((items) => {
          const arr = Array.isArray(items) ? items : [];
          setHoyCount(arr.length);
          if (arr.length > 0) {
            const ordenadas = arr.slice().sort((a, b) => {
              const da = toDateSafe(a.fecha, a.hora);
              const db = toDateSafe(b.fecha, b.hora);
              if (!da && !db) return 0;
              if (!da) return 1;
              if (!db) return -1;
              return da - db;
            });
            const first = ordenadas[0];
            const d = toDateSafe(first.fecha, first.hora);
            const fecha = d ? d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : String(first.fecha || "").slice(0, 10);
            const hora = d ? d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false }) : String(first.hora || "");
            setPrimeraReservaText(`${fecha} - ${hora} - ${first.servicio}`);
          } else {
            setPrimeraReservaText("Sin reservas");
          }
        })
        .catch(() => {
          setHoyCount(0);
          setPrimeraReservaText("Error de datos");
        });
    } else {
      fetch("http://localhost:5000/api/reservas/mis-reservas", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((reservas) => {
          const now = new Date();
          const arr = Array.isArray(reservas) ? reservas : [];
          const ordenadas = arr
            .map((r) => ({ r, d: toDateSafe(r.fecha, r.hora) }))
            .filter((x) => x.d || x.r?.fecha)
            .sort((a, b) => {
              if (a.d && b.d) return a.d - b.d;
              if (a.d) return -1;
              if (b.d) return 1;
              return String(a.r.fecha).localeCompare(String(b.r.fecha));
            });
          const upcoming = ordenadas.find((x) => x.d && x.d >= now);
          const past = ordenadas.filter((x) => x.d && x.d < now);
          const recentPast = past.length ? past[past.length - 1] : null;
          const next = upcoming || recentPast || ordenadas[0];
          if (next) {
            const fecha = next.d
              ? next.d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
              : String(next.r.fecha || "").slice(0, 10);
            const hora = next.d
              ? next.d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })
              : String(next.r.hora || "");
            setProximaReservaText(`${fecha} - ${hora} - ${next.r.servicio || ""}`.trim());
          } else {
            setProximaReservaText("Sin reservas");
          }
        })
        .catch(() => {
          setProximaReservaText("Error de datos");
        });
    }
  }, []);
  useEffect(() => {
    setImgIndex(0);
    const id = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isAdmin]);
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Segoe UI", sans-serif;
        }

        body {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: #fff;
        }

        .dashboard {
          min-height: 100vh;
          padding: 60px 5%;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          margin-top: 40px;
          gap: 28px;
        }

        .hero-text {
          max-width: 720px;
          text-align: center;
        }

        .hero-text h1 {
          font-size: 3rem;
          margin-bottom: 16px;
          color: #f8f5f0;
        }

        .hero-text p {
          color: #cbd5e1;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .hero-image {
          width: 760px;
          height: 380px;
          border-radius: 18px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(212, 175, 55, 0.25);
        }

        .hero-card {
          display: grid;
          gap: 20px;
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          padding: 25px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
          border: 1px solid rgba(212, 175, 55, 0.18);
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card h3 {
          font-size: 1rem;
          margin-bottom: 15px;
          color: #94a3b8;
        }

        .card-number {
          font-size: 2rem;
          font-weight: bold;
          color: #f8f5f0;
        }

        .card-sub {
          font-size: 1rem;
          color: #e5e7eb;
        }

        .status {
          color: #22c55e;
          font-weight: bold;
        }

        /* CTA styles removidos */

        @media (max-width: 900px) {
          .hero {
            flex-direction: column;
            text-align: center;
          }

          .hero-card {
            grid-template-columns: 1fr;
          }
          .hero-image {
            width: 100%;
            height: 220px;
          }
        }
      `}</style>

      <div className="dashboard">
        <section className="hero">
          <div className="hero-text">
            <h1>{panelTitle}</h1>
            <p>
              Gestiona tus citas de manera profesional, rápida y segura.
              Una experiencia moderna diseñada para optimizar tu tiempo.
            </p>
          </div>

          <div className="hero-image" style={{ backgroundImage: `url(${images[imgIndex]})` }} />

          <div className="hero-card" style={{ gridTemplateColumns: isAdmin ? "repeat(2, 260px)" : "repeat(1, 360px)" }}>
            {isAdmin ? (
              <>
                <div className="card">
                  <h3 style={{ color: "#94a3b8" }}>Citas de hoy</h3>
                  <span className="card-number">{hoyCount}</span>
                </div>
                <div className="card">
                  <h3 style={{ color: "#94a3b8" }}>Primera reserva</h3>
                  <span className="card-sub">{primeraReservaText}</span>
                </div>
              </>
            ) : (
              <div className="card">
                <h3 style={{ color: "#94a3b8" }}>Tu próxima reserva</h3>
                <span className="card-sub">{proximaReservaText}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
