// src/front/components/Card.jsx
import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Card = ({
  id,
  type = "people",
  title,
  image,
  fields = [],
  className = "",
}) => {
  const { store, dispatch, types } = useGlobalReducer();

  // ¿Es favorito?
  const isFav = store.favorites?.some((f) => f.id === id && f.type === type);

  // Fuentes de imagen
  const sources = [
    image,
    type === "people" && id != null
      ? `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`
      : null,
    type === "planets" && id != null
      ? `https://starwars-visualguide.com/assets/img/planets/${id}.jpg`
      : null,
    type === "vehicles" && id != null
      ? `https://starwars-visualguide.com/assets/img/vehicles/${id}.jpg`
      : null,
    id != null
      ? `https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img/${
          type === "people" ? "characters" : type
        }/${id}.jpg?raw=true`
      : null,
    // Placeholder SVG
    "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'>
          <rect width='100%' height='100%' fill='black'/>
          <text x='50%' y='50%' fill='white' dominant-baseline='middle' text-anchor='middle'
            font-family='sans-serif' font-size='20'>Imagen no disponible</text>
        </svg>`
      ),
  ].filter(Boolean);

  const [imgIdx, setImgIdx] = React.useState(0);
  const src = sources[Math.min(imgIdx, sources.length - 1)];
  const onImgError = () => setImgIdx((i) => Math.min(i + 1, sources.length - 1));

  const toggleFav = () => {
    dispatch({
      type: types.TOGGLE_FAVORITE,
      payload: { id, type, title },
    });
  };

  return (
    <div className={`card entity-card h-100 ${className}`}>
      {/* Imagen + estrella favoritos */}
      <div className="entity-card__img position-relative">
        <img
          src={src}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={onImgError}
        />
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

      {/* Cuerpo */}
      <div className="card-body entity-card__body d-flex flex-column">
        <h5 className="card-title mb-1">{title}</h5>

        {fields?.length > 0 && (
          <ul className="entity-card__list">
            {fields.map((f, idx) => (
              <li key={idx} className="entity-card__row">
                <span className="label">{f.label}</span>
                <span className="value">{f.value}</span>
              </li>
            ))}
          </ul>
        )}

        {/*  Botón “Más info” ahora navega a /{type}/{id} */}
        <div className="entity-card__actions mt-auto">
          <Link className="app-btn" to={`/${type}/${id}`} aria-label={`Ver más de ${title}`}>
            <i className="fa-solid fa-circle-info" />
            <span>Más info</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
