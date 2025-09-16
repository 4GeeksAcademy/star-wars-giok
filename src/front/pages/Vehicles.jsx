// src/front/pages/Vehicles.jsx
import React, { useEffect, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card";

const CACHE_KEY = "vehicles_list_cache_v1";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12h

export const Vehicles = () => {
  const { store, dispatch, types } = useGlobalReducer();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const now = Date.now();

    // 1) Intentar leer del cache
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (
          cached?.timestamp &&
          now - cached.timestamp < CACHE_TTL_MS &&
          Array.isArray(cached.data)
        ) {
          dispatch({ type: types.SET_VEHICLES, payload: cached.data });
          dispatch({ type: types.SET_ERROR, payload: null });
          dispatch({ type: types.SET_LOADING, payload: { vehicles: false } });
          return;
        }
      }
    } catch (err) {
      console.warn("Error leyendo cache:", err);
    }

    // 2) Fetch al backend
    const fetchVehicles = async () => {
      try {
        dispatch({ type: types.SET_LOADING, payload: { vehicles: true } });
        dispatch({ type: types.SET_ERROR, payload: null });

        const base = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${base}/api/vehicles`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        dispatch({ type: types.SET_VEHICLES, payload: data });
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: now, data })
        );
      } catch (err) {
        console.error("API vehicles falló:", err.message);
        dispatch({ type: types.SET_VEHICLES, payload: [] });
        dispatch({ type: types.SET_ERROR, payload: "No se pudieron cargar vehículos." });
      } finally {
        dispatch({ type: types.SET_LOADING, payload: { vehicles: false } });
      }
    };

    fetchVehicles();
  }, [dispatch, types]);

  const { loading, error, vehicles } = store;

  return (
    <div className="container section">
      <h2 className="mb-4">Vehicles</h2>

      {loading?.vehicles && (
        <div className="text-center">
          <div className="spinner-border text-warning" role="status" />
          <p className="mt-2">Cargando vehículos…</p>
        </div>
      )}

      {!loading?.vehicles && error && (
        <p className="text-danger">{error}</p>
      )}

      {!loading?.vehicles && !error && (
        <div className="cards-grid">
          {vehicles.map((v) => (
            <Card
              key={v.id}
              id={v.id}
              type="vehicles"
              title={v.name}
              fields={[
                { label: "Model", value: v.model || "—" },
                { label: "Crew", value: v.crew || "—" },
              ]}
            />
          ))}
          {vehicles.length === 0 && (
            <div className="text-muted">No hay vehículos.</div>
          )}
        </div>
      )}
    </div>
  );
};
