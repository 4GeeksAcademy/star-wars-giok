import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const { dispatch } = useGlobalReducer();

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) return;
        const response = await fetch(backendUrl + "/api/hello");
        const data = await response.json();
        if (response.ok) dispatch({ type: "set_hello", payload: data.message });
      } catch {
        console.warn("No se pudo obtener el mensaje del backend.");
      }
    };
    loadMessage();
  }, [dispatch]);

  return (
    <div className="hero">
      {/* Video de fondo */}
      <video
        className="hero__video"
        src="/video-home.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="hero__overlay" />

      {/* Contenido encima del video */}
      <div className="hero__content container text-center text-white">
        {/* Logo Star Wars */}
        <img
          src="/logo.png"
          alt="Star Wars"
          className="hero__logo mb-4"
        />

        {/* Eslogan */}
        <p className="hero__tagline mb-5">
          Hace mucho tiempo, en una galaxia muy, muy lejana…
        </p>

        {/* Iconos grandes */}
        <div className="d-flex justify-content-center gap-5 flex-wrap">
          <Link to="/people" className="hero__icon-link">
            <div className="hero__icon hero__icon--xl">
              <i className="fa-regular fa-user" aria-hidden="true" />
            </div>
            <span className="hero__label">People</span>
          </Link>

          <Link to="/planets" className="hero__icon-link">
            <div className="hero__icon hero__icon--xl">
              <i className="fa-solid fa-globe" aria-hidden="true" />
            </div>
            <span className="hero__label">Planets</span>
          </Link>

          <Link to="/vehicles" className="hero__icon-link">
            <div className="hero__icon hero__icon--xl">
              <i className="fa-solid fa-rocket" aria-hidden="true" />
            </div>
            <span className="hero__label">Vehicles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
