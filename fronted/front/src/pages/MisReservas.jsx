import { useEffect, useState } from "react";

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const user_id = localStorage.getItem("user_id");

  const cargarReservas = () => {
    fetch(`http://localhost:5000/api/mis-reservas/${user_id}`)
      .then(res => res.json())
      .then(data => setReservas(data));
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const cancelar = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/cancelar/${id}`,
      { method: "PUT" }
    );

    const data = await res.json();
    alert(data.message);

    cargarReservas();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Mis Reservas</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>{r.fecha}</td>
              <td>{r.hora}</td>
              <td>
                {r.puede_cancelar ? (
                  <button onClick={() => cancelar(r.id)}>
                    Cancelar
                  </button>
                ) : (
                  "No disponible"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
