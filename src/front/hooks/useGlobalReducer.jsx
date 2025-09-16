import { createContext, useContext, useReducer } from "react";

/* ========= Helpers de favoritos por usuario ========= */
function favKey(user) {
  // usa id si está; si no, email; si no, “guest”
  if (user?.id != null) return `favorites_u${user.id}`;
  if (user?.email) return `favorites_${user.email}`;
  return "favorites_guest";
}

function loadFavorites(user) {
  try {
    const key = favKey(user);
    const raw = localStorage.getItem(key);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavorites(user, favs) {
  try {
    const key = favKey(user);
    localStorage.setItem(key, JSON.stringify(favs || []));
  } catch {}
}

/* ========= Estado inicial ========= */
const initialState = {
  people: [],
  planets: [],
  vehicles: [],
  // en arranque no hay usuario → usa favoritos “guest”
  favorites: loadFavorites(null),

  auth: { token: localStorage.getItem("access_token") || null },
  user: null,

  loading: { people: false, planets: false, vehicles: false },
  error: null,
};

/* ========= Tipos de acción ========= */
const types = {
  SET_PEOPLE: "SET_PEOPLE",
  SET_PLANETS: "SET_PLANETS",
  SET_VEHICLES: "SET_VEHICLES",

  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",

  ADD_FAVORITE: "ADD_FAVORITE",
  REMOVE_FAVORITE: "REMOVE_FAVORITE",
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",

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
      const exists = state.favorites.some((f) => f.id === item.id && f.type === item.type);
      if (exists) return state;
      const nextFavs = [...state.favorites, item];
      saveFavorites(state.user, nextFavs); // 👈 clave por usuario
      return { ...state, favorites: nextFavs };
    }

    case types.REMOVE_FAVORITE: {
      const nextFavs = state.favorites.filter(
        (f) => !(f.id === action.payload.id && f.type === action.payload.type)
      );
      saveFavorites(state.user, nextFavs); // 👈 clave por usuario
      return { ...state, favorites: nextFavs };
    }

    case types.TOGGLE_FAVORITE: {
      const item = action.payload;
      const exists = state.favorites.some((f) => f.id === item.id && f.type === item.type);
      const nextFavs = exists
        ? state.favorites.filter((f) => !(f.id === item.id && f.type === item.type))
        : [...state.favorites, item];
      saveFavorites(state.user, nextFavs); // 👈 clave por usuario
      return { ...state, favorites: nextFavs };
    }

    case types.SET_AUTH:
      return { ...state, auth: { token: action.payload?.token || null } };

    case types.SET_USER: {
      // al cambiar de usuario, cargamos sus favoritos de su propia clave
      const nextUser = action.payload || null;
      const userFavs = loadFavorites(nextUser);
      return { ...state, user: nextUser, favorites: userFavs };
    }

    case types.LOGOUT: {
      // al salir, cambiamos a “guest” y cargamos sus favoritos (otra clave)
      const guestFavs = loadFavorites(null);
      return { ...state, auth: { token: null }, user: null, favorites: guestFavs };
    }

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
