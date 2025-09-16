// src/front/pages/Favorites.jsx
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card";

export const Favorites = () => {
  const { store } = useGlobalReducer();
  const favs = store.favorites || [];

  return (
    <div className="container section">
      <h2 className="mb-4">Favoritos</h2>

      {favs.length === 0 ? (
        <p className="text-muted">No tienes elementos en favoritos.</p>
      ) : (
        <div className="cards-grid">
          {favs.map((f) => (
            <Card
              key={`${f.type}-${f.id}`}
              id={f.id}
              type={f.type}          // "people" | "planets" | "vehicles"
              title={f.title}        // guardado cuando pulsaste la estrella
              // Card ya resuelve la imagen por id/type, no hace falta pasar fields
            />
          ))}
        </div>
      )}
    </div>
  );
};
