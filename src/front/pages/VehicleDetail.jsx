// src/front/pages/VehicleDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CardDetail } from "../components/CardDetail";

export const VehicleDetail = () => {
  const { id } = useParams();
  const numId = Number(id);
  const { store } = useGlobalReducer();

  // Nombre desde la lista si tarda en cargar
  const nameFromList = useMemo(() => {
    const hit = store.vehicles?.find((v) => Number(v.id) === numId);
    return hit?.name || undefined;
  }, [store.vehicles, numId]);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const base = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${base}/api/vehicles/${numId}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setVehicle({
          id: numId,
          name: data.name ?? nameFromList ?? `Vehicle #${numId}`,
          model: data.model ?? "—",
          manufacturer: data.manufacturer ?? "—",
          crew: data.crew ?? "—",
          passengers: data.passengers ?? "—",
          vehicle_class: data.vehicle_class ?? "—",
        });
      } catch {
        // fallback silencioso
        setVehicle({
          id: numId,
          name: nameFromList ?? `Vehicle #${numId}`,
          model: "—",
          manufacturer: "—",
          crew: "—",
          passengers: "—",
          vehicle_class: "—",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [numId, nameFromList]);

  // Imágenes (similar a people/planets)
  const imageSources = useMemo(
    () => [
      `https://starwars-visualguide.com/assets/img/vehicles/${numId}.jpg?v=${numId}`,
      `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/vehicles/${numId}.jpg?raw=true&v=${numId}`,
    ],
    [numId]
  );

  if (loading) {
    return (
      <div className="container section text-center">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-2">Cargando vehículo…</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container section">
        <p className="text-danger">No se pudo cargar el vehículo.</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <CardDetail
        key={numId}
        type="vehicles"
        id={numId}
        title={vehicle.name}
        imageSources={imageSources}
        fields={[
          { label: "Model", value: vehicle.model },
          { label: "Manufacturer", value: vehicle.manufacturer },
          { label: "Crew", value: vehicle.crew },
          { label: "Passengers", value: vehicle.passengers },
          { label: "Class", value: vehicle.vehicle_class },
        ]}
        backLink="/vehicles"
        backLabel="Volver a Vehicles"
      />
    </div>
  );
};
