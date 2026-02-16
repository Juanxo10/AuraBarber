import { useEffect, useState } from "react";

export default function Historial() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const toDateSafe = (r) => {
    const h = String(r.hora || "").trim();
    const hhmm = /^\d{2}:\d{2}$/;
    const hhmmss = /^\d{2}:\d{2}:\d{2}$/;
    const t = hhmm.test(h) ? `${h}:00` : hhmmss.test(h) ? h : null;
    if (!t || !r.fecha) return null;
    const d = new Date(`${r.fecha}T${t}`);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setCargando(true);
    fetch("http://localhost:5000/api/reservas/mis-reservas", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const ordenadas = arr.slice().sort((a, b) => {
          const da = toDateSafe(a);
          const db = toDateSafe(b);
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return db - da;
        });
        setReservas(ordenadas);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Segoe UI", sans-serif; }
        html, body, #root { height: 100%; }
        body { margin: 0; background: linear-gradient(135deg,#0f172a,#1e293b); color: #f8f5f0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .dashboard { min-height: 100vh; padding: 60px 5%; }
        .hero { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 24px; }
        .hero h1 { font-size: 2.2rem; color: #f8f5f0; }
        .section { width: 100%; display: flex; justify-content: center; }
        .card { width: 960px; background: rgba(255,255,255,0.06); border: 1px solid rgba(212,175,55,0.25); border-radius: 16px; padding: 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.45); }
        table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 12px; }
        thead tr { background: rgba(255,255,255,0.08); }
        th, td { padding: 12px; }
        tbody tr { border-top: 1px solid rgba(255,255,255,0.1); }
        .status-ok { color: #22c55e; font-weight: 700; }
        .status-pending { color: #b87333; font-weight: 700; }
        .empty { padding: 16px; text-align: center; color: #9ca3af; }
      `}</style>
      <div className="dashboard">
        <div className="hero">
          <h1>Historial de cortes</h1>
        </div>
        {cargando && <div style={{ textAlign: "center", color: "#cbd5e1" }}>Cargando...</div>}
        {!cargando && (
          <div className="section">
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r, i) => {
                    const d = toDateSafe(r);
                    const fecha = String(r.fecha || "").slice(0, 10);
                    const hora = d
                      ? d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })
                      : r.hora;
                    return (
                      <tr key={i}>
                        <td>{fecha}</td>
                        <td>{hora}</td>
                        <td>{r.servicio}</td>
                        <td className={r.estado === "Confirmada" ? "status-ok" : "status-pending"}>{r.estado}</td>
                      </tr>
                    );
                  })}
                  {reservas.length === 0 && (
                    <tr><td className="empty" colSpan={4}>Sin historial</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
