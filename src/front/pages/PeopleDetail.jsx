// src/front/pages/PeopleDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CardDetail } from "../components/CardDetail";

export const PeopleDetail = () => {
  const { id } = useParams();
  const numId = Number(id);
  const { store } = useGlobalReducer();

  // Nombre desde la lista por si tarda en cargar
  const nameFromList = useMemo(() => {
    const hit = store.people?.find((p) => Number(p.id) === numId);
    return hit?.name || undefined;
  }, [store.people, numId]);

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const base = import.meta.env.VITE_BACKEND_URL || "";
        const res = await fetch(`${base}/api/people/${numId}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setPerson({
          id: numId,
          name: data.name ?? nameFromList ?? `Person #${numId}`,
          gender: data.gender ?? "—",
          hair_color: data.hair_color ?? "—",
          eye_color: data.eye_color ?? "—",
          birth_year: data.birth_year ?? "—",
          height: data.height ?? "—",
          mass: data.mass ?? "—",
        });
      } catch {
        // fallback básico
        setPerson({
          id: numId,
          name: nameFromList ?? `Person #${numId}`,
          gender: "—",
          hair_color: "—",
          eye_color: "—",
          birth_year: "—",
          height: "—",
          mass: "—",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [numId, nameFromList]);

  // Fuentes de imagen con cache buster
  const imageSources = useMemo(
    () => [
      `https://starwars-visualguide.com/assets/img/characters/${numId}.jpg?v=${numId}`,
      `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/characters/${numId}.jpg?raw=true&v=${numId}`,
    ],
    [numId]
  );

  if (loading) {
    return (
      <div className="container section text-center">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-2">Cargando personaje…</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="container section">
        <p className="text-danger">No se pudo cargar el personaje.</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <CardDetail
        key={numId}  // 👈 fuerza el remount
        title={person.name}
        imageSources={imageSources}
        fields={[
          { label: "Gender", value: person.gender },
          { label: "Hair Color", value: person.hair_color },
          { label: "Eye Color", value: person.eye_color },
          { label: "Birth Year", value: person.birth_year },
          {
            label: "Height",
            value: person.height !== "—" ? `${person.height} cm` : "—",
          },
          {
            label: "Mass",
            value: person.mass !== "—" ? `${person.mass} kg` : "—",
          },
        ]}
        backLink="/people"
        backLabel="Volver a People"
      />
    </div>
  );
};
