// src/front/pages/Home.jsx
import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) return; // ✅ no hay backend, no hacemos fetch

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
      return data;
    } catch (error) {
      // Mantengo tu manejo, pero evito romper la UI
      console.warn(
        "No se pudo obtener el mensaje del backend. ¿Está corriendo y accesible?"
      );
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="container section text-center">
      <h1 className="home-title">Bienvenido</h1>
      <p className="home-subtitle"> comienza tu proyecto 🚀</p>
      {/* Aquí podrás añadir tus cards o contenido */}
    </div>
  );
};
