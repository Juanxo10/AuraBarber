import { useEffect, useState } from "react";

export default function Agendar() {
  const [fecha, setFecha] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [servicio, setServicio] = useState("");
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const serviciosList = ["Corte clásico", "Corte + barba", "Solo barba"];
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  

  const horasBase = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00"
  ];

  useEffect(() => {
    if (!fecha) return;

    setLoading(true);

    fetch(`http://localhost:5000/api/reservas/horarios/${fecha}`)
      .then(res => res.json())
      .then(data => {
      
        if (!Array.isArray(data) || data.length === 0) {
          const generado = horasBase.map(h => ({
            hora: h,
            ocupado: false
          }));
          setHorarios(generado);
        } else {
          setHorarios(data);
        }

        setHoraSeleccionada("");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando horarios:", err);

  
        const generado = horasBase.map(h => ({
          hora: h,
          ocupado: false
        }));

        setHorarios(generado);
        setLoading(false);
      });
  }, [fecha]);

  const confirmarReserva = async () => {
    if (!fecha || !horaSeleccionada || !servicio) {
      setMensaje("Completa todos los campos");
      return;
    }

    const fechaHora = new Date(`${fecha}T${horaSeleccionada}:00`);
    if (Number.isNaN(fechaHora.getTime())) {
      setMensaje("Fecha u hora inválida");
      return;
    }
    const ahora = new Date();
    const minAnticipacionMs = 60 * 60 * 1000;
    if (fechaHora.getTime() - ahora.getTime() < minAnticipacionMs) {
      setMensaje("Debes reservar con al menos 1 hora de anticipación");
      return;
    }
    const maxDate = new Date(ahora);
    maxDate.setFullYear(ahora.getFullYear() + 2);
    if (fechaHora > maxDate) {
      setMensaje(`Solo se puede agendar hasta ${maxDate.toISOString().slice(0,10)}`);
      return;
    }
    if (fechaHora.getDay() === 0) {
      setMensaje("Domingos no están disponibles");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("Debes iniciar sesión para agendar");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/reservas/reservar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fecha,
            hora: horaSeleccionada,
            servicio
          })
        }
      );

      const data = await res.json();
      setMensaje(data.message);

    
      setFecha("");
      setHoraSeleccionada("");
      setServicio("");

    } catch (err) {
      setMensaje("Error al reservar");
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Segoe UI", sans-serif; }
        html, body, #root { height: 100%; }
        body { margin: 0; background: linear-gradient(135deg,#0f172a,#1e293b); color: #f8f5f0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
        <div style={{ width: 760, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 18, padding: 32, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
          <h1 style={{ marginBottom: 18, color: "#f8f5f0", fontSize: "2rem" }}>Agendar Cita</h1>

          <input
            type="date"
            value={fecha}
            min={new Date().toISOString().slice(0,10)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().slice(0,10)}
            onChange={e => setFecha(e.target.value)}
            style={{ padding: 12, width: "100%", marginBottom: 16, borderRadius: 10, border: "1px solid #374151", background: "rgba(255,255,255,0.08)", color: "#f8f5f0" }}
          />

          {fecha && (
            <>
              <h3 style={{ color: "#cbd5e1", marginBottom: 12 }}>Selecciona la hora</h3>

              {loading && <p style={{ color: "#cbd5e1" }}>Cargando horarios...</p>}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                {horarios.map((h, i) => (
                  <button
                    key={i}
                    disabled={h.ocupado}
                    onClick={() => setHoraSeleccionada(h.hora)}
                    style={{
                      padding: 12,
                      fontSize: 15,
                      borderRadius: 10,
                      cursor: h.ocupado ? "not-allowed" : "pointer",
                      background:
                        h.ocupado ? "rgba(255,255,255,0.08)" :
                        horaSeleccionada === h.hora ? "#d4af37" : "transparent",
                      color: h.ocupado ? "#9ca3af" : horaSeleccionada === h.hora ? "#1b1b1b" : "#d4af37",
                      border: h.ocupado ? "1px solid #374151" : "1px solid #d4af37",
                      fontWeight: 600
                    }}
                  >
                    {h.ocupado ? `Ocupado ${h.hora}` : h.hora}
                  </button>
                ))}
              </div>

              {horaSeleccionada && (
                <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 700, color: "#22c55e" }}>
                  Hora seleccionada: {horaSeleccionada}
                </div>
              )}
            </>
          )}

          <div style={{ position: "relative", marginBottom: 22 }}>
            <button
              onClick={() => setServiciosOpen((o) => !o)}
              style={{
                padding: 12,
                width: "100%",
                borderRadius: 10,
                border: "1px solid #d4af37",
                background: "rgba(255,255,255,0.08)",
                color: servicio ? "#f8f5f0" : "#cbd5e1",
                textAlign: "left",
                fontWeight: 600
              }}
            >
              {servicio || "Seleccionar servicio"}
            </button>
            {serviciosOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#111827",
                  border: "1px solid rgba(212,175,55,0.25)",
                  borderRadius: 12,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
                  zIndex: 50,
                  maxHeight: 200,
                  overflowY: "auto"
                }}
              >
                {serviciosList.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setServicio(s);
                      setServiciosOpen(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottom: "1px solid rgba(212,175,55,0.16)",
                      color: "#f8f5f0",
                      cursor: "pointer"
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={confirmarReserva}
            style={{ padding: "12px", width: "100%", background: "#d4af37", color: "#1b1b1b", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Confirmar Reserva
          </button>

          {mensaje && (
            <p style={{ marginTop: 16, fontWeight: 700, color: mensaje.toLowerCase().includes("error") ? "#b91c1c" : "#22c55e" }}>
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
