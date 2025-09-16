// src/front/pages/Planets.jsx
import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card";

export const Planets = () => {
  const { store, dispatch, types } = useGlobalReducer();

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        dispatch({ type: types.SET_LOADING, payload: { planets: true } });
        dispatch({ type: types.SET_ERROR, payload: null });

        const base = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${base}/api/planet`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json(); // [{ id, name, diameter }, ...]
        if (!alive) return;

        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: Number(p.id),
          name: p.name ?? "",
          diameter: p.diameter ?? "",
          image: p.image ?? null, // si algún día lo agregas en tu API
        }));

        dispatch({ type: types.SET_PLANETS, payload: mapped });
      } catch (err) {
        console.error("Error cargando /api/planet:", err);
        dispatch({ type: types.SET_ERROR, payload: "No se pudo cargar Planets." });
        dispatch({ type: types.SET_PLANETS, payload: [] });
      } finally {
        dispatch({ type: types.SET_LOADING, payload: { planets: false } });
      }
    };

    load();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planets = Array.isArray(store.planets) ? store.planets : [];
  const { loading, error } = store;

  return (
    <div className="container section">
      <div className="d-flex align-items-center mb-3">
        <i className="fa-solid fa-globe me-2" />
        <h2 className="m-0">Planets</h2>
      </div>

      {loading?.planets && (
        <div className="text-center">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2">Cargando…</p>
        </div>
      )}

      {!loading?.planets && error && <p className="text-danger">{error}</p>}

      {!loading?.planets && !error && (
        <div className="cards-grid">
          {planets.map((p) => (
            <Card
              key={p.id}
              id={p.id}
              type="planets"               // importante para las imágenes del visual guide
              title={p.name}
              image={p.image}
              fields={[
                { label: "ID", value: p.id },
                {
                  label: "Diameter",
                  value:
                    p.diameter || p.diameter === 0
                      ? `${p.diameter} km`
                      : "—",
                },
              ]}
            />
          ))}

          {planets.length === 0 && (
            <div className="text-muted">No hay resultados.</div>
          )}
        </div>
      )}
    </div>
  );
};

// (opcional) export default para evitar problemas si alguna vez lo importas por defecto
export default Planets;
