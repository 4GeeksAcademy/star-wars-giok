// src/front/hooks/useGlobalReducer.jsx
import { createContext, useContext, useReducer } from "react";

// --- helpers seguros para localStorage ---
function loadFavorites() {
  try {
    const raw = localStorage.getItem("favorites");
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveFavorites(favs) {
  try {
    localStorage.setItem("favorites", JSON.stringify(favs || []));
  } catch {}
}

/* ========= Estado inicial ========= */
const initialState = {
  people: [],
  planets: [],
  vehicles: [],
  favorites: loadFavorites(), // <— persistidos

  // opcional: si usas auth más adelante
  auth: { token: localStorage.getItem("access_token") || null },
  user: null,

  loading: { people: false, planets: false, vehicles: false },
  error: null,
};

/* ========= Tipos de acción ========= */
const types = {
  // Listas
  SET_PEOPLE: "SET_PEOPLE",
  SET_PLANETS: "SET_PLANETS",
  SET_VEHICLES: "SET_VEHICLES",

  // Estado UI
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",

  // Favoritos (frontend)
  ADD_FAVORITE: "ADD_FAVORITE",
  REMOVE_FAVORITE: "REMOVE_FAVORITE",
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",

  // Auth opcional (por si ya lo usas en Login/Register)
  SET_AUTH: "SET_AUTH",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
};

/* ========= Reducer ========= */
function reducer(state, action) {
  switch (action.type) {
    case types.SET_LOADING:
      return { ...state, loading: { ...state.loading, ...action.payload } };

    case types.SET_ERROR:
      return { ...state, error: action.payload ?? null };

    case types.SET_PEOPLE:
      return { ...state, people: Array.isArray(action.payload) ? action.payload : [] };

    case types.SET_PLANETS:
      return { ...state, planets: Array.isArray(action.payload) ? action.payload : [] };

    case types.SET_VEHICLES:
      return { ...state, vehicles: Array.isArray(action.payload) ? action.payload : [] };

    case types.ADD_FAVORITE: {
      const item = action.payload; // { id, type, title }
      const exists = state.favorites.some(
        (f) => f.id === item.id && f.type === item.type
      );
      if (exists) return state;
      const nextFavs = [...state.favorites, item];
      saveFavorites(nextFavs);
      return { ...state, favorites: nextFavs };
    }

    case types.REMOVE_FAVORITE: {
      const nextFavs = state.favorites.filter(
        (f) => !(f.id === action.payload.id && f.type === action.payload.type)
      );
      saveFavorites(nextFavs);
      return { ...state, favorites: nextFavs };
    }

    case types.TOGGLE_FAVORITE: {
      const item = action.payload; // { id, type, title }
      const exists = state.favorites.some(
        (f) => f.id === item.id && f.type === item.type
      );
      const nextFavs = exists
        ? state.favorites.filter((f) => !(f.id === item.id && f.type === item.type))
        : [...state.favorites, item];
      saveFavorites(nextFavs);
      return { ...state, favorites: nextFavs };
    }

    case types.SET_AUTH:
      return { ...state, auth: { token: action.payload?.token || null } };

    case types.SET_USER:
      return { ...state, user: action.payload || null };

    case types.LOGOUT:
      // no borro favoritos en logout (son “read later” locales)
      return { ...state, auth: { token: null }, user: null };

    default:
      return state;
  }
}

/* ========= Context & Provider ========= */
const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ store, dispatch, types }}>
      {children}
    </StoreContext.Provider>
  );
}

/* ========= Hook ========= */
export default function useGlobalReducer() {
  return useContext(StoreContext);
}
