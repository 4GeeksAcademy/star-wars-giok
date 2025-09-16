// src/front/pages/People.jsx
import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card";

export const People = () => {
  const { store, dispatch, types } = useGlobalReducer();

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        dispatch({ type: types.SET_LOADING, payload: { people: true } });
        dispatch({ type: types.SET_ERROR, payload: null });

        const base = import.meta.env.VITE_BACKEND_URL || ""; // si front y back comparten host, puede ir vacío
        const res = await fetch(`${base}/api/people`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json(); // [{id, name, gender, hair_color, ...}]
        if (!alive) return;

        // Normalizamos por si falta algo
        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: Number(p.id),
          name: p.name ?? "",
          gender: p.gender ?? "",
          hair_color: p.hair_color ?? "",
          image: p.image ?? null,
        }));

        dispatch({ type: types.SET_PEOPLE, payload: mapped });
      } catch (err) {
        console.error("Error cargando /api/people:", err);
        dispatch({ type: types.SET_ERROR, payload: "No se pudo cargar People." });
        dispatch({ type: types.SET_PEOPLE, payload: [] });
      } finally {
        dispatch({ type: types.SET_LOADING, payload: { people: false } });
      }
    };

    load();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error, people } = store;

  return (
    <div className="container section">
      <div className="d-flex align-items-center mb-3">
        <i className="fa-regular fa-user me-2" />
        <h2 className="m-0">People</h2>
      </div>

      {loading?.people && (
        <div className="text-center">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2">Cargando…</p>
        </div>
      )}

      {!loading?.people && error && <p className="text-danger">{error}</p>}

      {!loading?.people && !error && (
        <div className="cards-grid">
          {people.map((p) => (
            <Card
              key={p.id}
              id={p.id}
              type="people"
              title={p.name}
              image={p.image}
              fields={[
                { label: "Gender", value: p.gender || "—" },
                { label: "Hair", value: p.hair_color || "—" },
              ]}
            />
          ))}

          {people.length === 0 && (
            <div className="text-muted">No hay resultados.</div>
          )}
        </div>
      )}
    </div>
  );
};
