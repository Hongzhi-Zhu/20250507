import React, { useState, useEffect } from 'react';

function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [seleccionPelicula, setSeleccionPelicula] = useState(null);
  const [seleccionSesion, setSeleccionSesion] = useState(null);
  const [asientosOcupados, setAsientosOcupados] = useState([]);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/peliculas/')
      .then(res => res.json())
      .then(data => setPeliculas(data));
  }, []);

  useEffect(() => {
    if (seleccionPelicula) {
      fetch(`http://localhost:8000/api/sesiones/?pelicula=${seleccionPelicula.id}`)
        .then(res => res.json())
        .then(data => setSesiones(data));
    }
  }, [seleccionPelicula]);

  useEffect(() => {
    if (seleccionSesion) {
      fetch(`http://localhost:8000/api/entradas/?sesion=${seleccionSesion.id}`)
        .then(res => res.json())
        .then(data => {
          const ocupados = data.map(e => e.asiento_numero);
          setAsientosOcupados(ocupados);
        });
    }
  }, [seleccionSesion]);

  const reservarAsiento = () => {
    fetch('http://localhost:8000/api/entradas/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        sesion: seleccionSesion.id,
        asiento_numero: asientoSeleccionado,
        comprador_email: 'test@example.com'
      }),
    }).then(res => {
      if (res.ok) {
        alert('Entrada reservada!');
        // refrescar asientos ocupados
        fetch(`http://localhost:8000/api/entradas/?sesion=${seleccionSesion.id}`)
          .then(res => res.json())
          .then(data => {
            const ocupados = data.map(e => e.asiento_numero);
            setAsientosOcupados(ocupados);
            setAsientoSeleccionado(null);
          });
      } else {
        alert('Error al reservar asiento.');
      }
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Películas</h1>
      <ul>
        {peliculas.map(p => (
          <li key={p.id} onClick={() => {
            setSeleccionPelicula(p);
            setSeleccionSesion(null);
            setSesiones([]);
            setAsientosOcupados([]);
            setAsientoSeleccionado(null);
          }} style={{ cursor: 'pointer', marginBottom: 5 }}>
            {p.titulo}
          </li>
        ))}
      </ul>

      {seleccionPelicula && (
        <>
          <h2>Sesiones de {seleccionPelicula.titulo}</h2>
          <ul>
            {sesiones.map(s => (
              <li key={s.id} onClick={() => {
                setSeleccionSesion(s);
                setAsientoSeleccionado(null);
              }} style={{ cursor: 'pointer', marginBottom: 5 }}>
                {new Date(s.fecha_hora).toLocaleString()} - Sala {s.sala}
              </li>
            ))}
          </ul>
        </>
      )}

      {seleccionSesion && (
        <>
          <h3>Selecciona un asiento (1-{seleccionSesion.asientos_totales})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 300 }}>
            {[...Array(seleccionSesion.asientos_totales)].map((_, i) => {
              const asientoNum = i + 1;
              const ocupado = asientosOcupados.includes(asientoNum);
              return (
                <button
                  key={asientoNum}
                  disabled={ocupado}
                  onClick={() => setAsientoSeleccionado(asientoNum)}
                  style={{
                    margin: 2,
                    backgroundColor: asientoNum === asientoSeleccionado ? 'green' : ocupado ? 'red' : 'lightgray',
                    width: 30,
                    height: 30,
                    border: 'none',
                    borderRadius: 4,
                    cursor: ocupado ? 'not-allowed' : 'pointer'
                  }}
                >
                  {asientoNum}
                </button>
              );
            })}
          </div>
          <button
            disabled={!asientoSeleccionado}
            onClick={reservarAsiento}
            style={{
              marginTop: 10,
              padding: '8px 12px',
              cursor: asientoSeleccionado ? 'pointer' : 'not-allowed'
            }}
          >
            Confirmar compra
          </button>
        </>
      )}
    </div>
  );
}

export default App;
