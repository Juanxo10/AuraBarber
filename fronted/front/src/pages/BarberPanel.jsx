import { useEffect, useMemo, useState } from "react";

export default function BarberPanel() {
  const [vista, setVista] = useState("dia");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token");
  const parseDate = (s) => new Date(String(s).includes("T") ? String(s) : `${s}T00:00:00`);

  const fetchDia = async (f) => {
    if (!token) return;
    setCargando(true);
    const res = await fetch(`http://localhost:5000/api/reservas/agenda/dia?fecha=${f}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data);
    setCargando(false);
  };

  const startOfWeek = (d) => {
    const dt = new Date(d);
    const day = dt.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(dt);
    monday.setDate(dt.getDate() - diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return [monday.toISOString().slice(0, 10), sunday.toISOString().slice(0, 10)];
  };

  const fetchSemana = async (f) => {
    if (!token) return;
    setCargando(true);
    const [desde, hasta] = startOfWeek(f);
    const res = await fetch(`http://localhost:5000/api/reservas/agenda/semana?desde=${desde}&hasta=${hasta}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data);
    setCargando(false);
  };

  useEffect(() => {
    if (vista === "dia") fetchDia(fecha);
    else fetchSemana(fecha);
  }, [vista, fecha]);

  const grupos = useMemo(() => {
    if (vista === "dia") return { [fecha]: items };
    const map = {};
    items.forEach((r) => {
      if (!map[r.fecha]) map[r.fecha] = [];
      map[r.fecha].push(r);
    });
    return map;
  }, [items, vista, fecha]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Segoe UI", sans-serif; }
        html, body, #root { height: 100%; }
        body { margin: 0; background: linear-gradient(135deg,#0f172a,#1e293b); color: #f8f5f0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .dashboard { min-height: 100vh; padding: 60px 5%; }
        .hero { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 24px; }
        .hero h1 { font-size: 2.2rem; color: #f8f5f0; }
        .controls { width: 760px; display: flex; gap: 12px; align-items: center; justify-content: center; }
        .btn { padding: 10px 16px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .btn-primary { background: #d4af37; color: #1b1b1b; border: none; }
        .btn-secondary { background: transparent; color: #d4af37; border: 1px solid #d4af37; }
        .input-date { padding: 10px 12px; border-radius: 10px; border: 1px solid #374151; background: rgba(255,255,255,0.08); color: #f8f5f0; }
        .section { width: 100%; display: flex; justify-content: center; }
        .card { width: 960px; background: rgba(255,255,255,0.06); border: 1px solid rgba(212,175,55,0.25); border-radius: 16px; padding: 20px; box-shadow: 0 12px 30px rgba(0,0,0,0.45); margin-bottom: 20px; }
        .card h2 { color: #f8f5f0; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 12px; }
        thead tr { background: rgba(255,255,255,0.08); }
        th, td { padding: 12px; }
        tbody tr { border-top: 1px solid rgba(255,255,255,0.1); }
        .status-ok { color: #22c55e; font-weight: 700; }
        .status-pending { color: #b87333; font-weight: 700; }
      `}</style>
      <div className="dashboard">
        <div className="hero">
          <h1>Panel del Barbero</h1>
          <div className="controls">
            <button className="btn btn-secondary" onClick={() => setVista("dia")} style={{ background: vista === "dia" ? "#d4af37" : "transparent", color: vista === "dia" ? "#1b1b1b" : "#d4af37", borderColor: "#d4af37" }}>Día</button>
            <button className="btn btn-secondary" onClick={() => setVista("semana")} style={{ background: vista === "semana" ? "#d4af37" : "transparent", color: vista === "semana" ? "#1b1b1b" : "#d4af37", borderColor: "#d4af37" }}>Semana</button>
            <input className="input-date" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
        </div>
        {cargando && <div style={{ textAlign: "center", color: "#cbd5e1" }}>Cargando...</div>}
        {!cargando &&
          Object.keys(grupos)
            .sort()
            .map((f) => (
              <div key={f} className="section">
                <div className="card">
                  <h2>
                    {parseDate(f).toLocaleDateString("es-ES", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
                  </h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(grupos[f] || []).map((r) => (
                        <tr key={r.id}>
                          <td>{r.hora}</td>
                          <td>{r.nombre}</td>
                          <td>{r.servicio}</td>
                          <td className={r.estado === "Confirmada" ? "status-ok" : "status-pending"}>{r.estado}</td>
                        </tr>
                      ))}
                      {(!grupos[f] || grupos[f].length === 0) && (
                        <tr>
                          <td colSpan={4} style={{ padding: "16px", textAlign: "center", color: "#9ca3af" }}>Sin citas</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
