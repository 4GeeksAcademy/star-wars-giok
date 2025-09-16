// src/front/components/CardDetail.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CardDetail = ({
  id,
  type = "people",
  title,
  imageSources = [],
  fields = [],
  backLink = "/",
  backLabel = "Volver",
}) => {
  const { store, dispatch, types } = useGlobalReducer();
  const [imgIdx, setImgIdx] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  // ¿Es favorito este elemento?
  const isFav = store.favorites?.some((f) => f.id === id && f.type === type);

  const toggleFav = () => {
    dispatch({
      type: types.TOGGLE_FAVORITE,
      payload: { id, type, title },
    });
  };

  const src = imageSources[Math.min(imgIdx, imageSources.length - 1)];

  const handleImgError = () => {
    setImgIdx((i) => Math.min(i + 1, imageSources.length - 1));
  };

  useEffect(() => {
    setImgLoaded(false);
  }, [imgIdx, src]);

  return (
    <div className="card entity-card p-3">
      <div className="row g-3">
        {/* Columna Imagen */}
        <div className="col-12 col-md-5">
          <div className="entity-card__img position-relative">
            {!imgLoaded && (
              <div className="skeleton w-100 h-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-warning" role="status" />
              </div>
            )}
            <img
              key={src}
              src={src}
              alt={title}
              className="w-100 h-100"
              style={{ objectFit: "cover", display: imgLoaded ? "block" : "none" }}
              onLoad={() => setImgLoaded(true)}
              onError={handleImgError}
            />

            {/* Botón favoritos */}
            <button
              className={`favorite-btn ${isFav ? "active" : ""}`}
              title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
              aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={(e) => {
                e.preventDefault();
                toggleFav();
              }}
            >
              <i className={isFav ? "fa-solid fa-star" : "fa-regular fa-star"} />
            </button>
          </div>
        </div>

        {/* Columna Detalles */}
        <div className="col-12 col-md-7 d-flex flex-column">
          <h3 className="mb-3">{title}</h3>
          <ul className="entity-card__list flex-grow-1">
            {fields.map((f, idx) => (
              <li key={idx} className="entity-card__row">
                <span className="label">{f.label}:</span>
                <span className="value">{f.value}</span>
              </li>
            ))}
          </ul>
          <div>
            <Link to={backLink} className="app-btn">
              <i className="fa-solid fa-arrow-left me-2" />
              {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
