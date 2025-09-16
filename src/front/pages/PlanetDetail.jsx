// src/front/pages/PlanetDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CardDetail } from "../components/CardDetail";

export const PlanetDetail = () => {
  const { id } = useParams();
  const numId = Number(id);
  const { store } = useGlobalReducer();

  // Nombre desde la lista por si tarda en cargar
  const nameFromList = useMemo(() => {
    const hit = store.planets?.find((p) => Number(p.id) === numId);
    return hit?.name || undefined;
  }, [store.planets, numId]);

  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const base = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${base}/api/planet/${numId}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setPlanet({
          id: numId,
          name: data.name ?? nameFromList ?? `Planet #${numId}`,
          diameter: data.diameter ?? "—",
        });
      } catch {
        // Fallback sin mostrar error en UI
        setPlanet({
          id: numId,
          name: nameFromList ?? `Planet #${numId}`,
          diameter: "—",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [numId, nameFromList]);

  // Fuentes de imagen (Visual Guide + fallback)
  const imageSources = useMemo(
    () => [
      `https://starwars-visualguide.com/assets/img/planets/${numId}.jpg?v=${numId}`,
      `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/planets/${numId}.jpg?raw=true&v=${numId}`,
    ],
    [numId]
  );

  if (loading) {
    return (
      <div className="container section text-center">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-2">Cargando planeta…</p>
      </div>
    );
  }

  if (!planet) {
    return (
      <div className="container section">
        <p className="text-danger">No se pudo cargar el planeta.</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <CardDetail
        key={numId}         // fuerza remount al cambiar de id
        id={planet.id}
        type="planets"      // importante para favoritos
        title={planet.name}
        imageSources={imageSources}
        fields={[
          {
            label: "Diameter",
            value:
              planet.diameter !== "—" && planet.diameter !== null && planet.diameter !== undefined
                ? `${planet.diameter} km`
                : "—",
          },
        ]}
        backLink="/planets"
        backLabel="Volver a Planets"
      />
    </div>
  );
};
