// src/front/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoginModal } from "./LoginModal";

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mantener estado de autenticación en cambios de ruta o al cerrar/abrir modal
  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem("access_token")));
  }, [showLogin, location.pathname]);

  // Permitir que Register abra este modal con window.dispatchEvent(new Event("openLoginModal"))
  useEffect(() => {
    const open = () => setShowLogin(true);
    window.addEventListener("openLoginModal", open);
    return () => window.removeEventListener("openLoginModal", open);
  }, []);

  const handleLoginSuccess = (token) => {
    if (token) localStorage.setItem("access_token", token);
    setIsAuthed(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthed(false);
    if (location.pathname.startsWith("/favorites")) navigate("/");
  };

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    if (!isAuthed) {
      setShowLogin(true);
      return;
    }
    navigate("/favorites");
  };

  const isActiveAny = (prefixes) =>
    prefixes.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {/* NAVBAR superior */}
      <nav className="navbar bg-black text-white" role="navigation" aria-label="Main">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="d-inline-flex align-items-center" aria-label="Ir al inicio">
            <img src="/logo.png" alt="Logo" className="brand-logo" />
          </Link>

          {/* Desktop: botones */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <Link
              to="/people"
              className={`app-btn ${isActiveAny(["/people"]) ? "is-active" : ""}`}
              title="People"
              aria-label="People"
            >
              <i className="fa-regular fa-user" />
              <span>People</span>
            </Link>

            <Link
              to="/planets"
              className={`app-btn ${isActiveAny(["/planets"]) ? "is-active" : ""}`}
              title="Planets"
              aria-label="Planets"
            >
              <i className="fa-solid fa-globe" />
              <span>Planets</span>
            </Link>

            <Link
              to="/vehicles"
              className={`app-btn ${isActiveAny(["/vehicles"]) ? "is-active" : ""}`}
              title="Vehicles"
              aria-label="Vehicles"
            >
              <i className="fa-solid fa-shuttle-space" />
              <span>Vehicles</span>
            </Link>

            {isAuthed && (
              <button
                className={`app-btn ${isActiveAny(["/favorites"]) ? "is-active" : ""}`}
                onClick={handleFavoritesClick}
                title="Favoritos"
                aria-label="Favoritos"
              >
                <i className="fa-regular fa-star" />
                <span>Favoritos</span>
              </button>
            )}

            {isAuthed ? (
              <button
                className="app-btn"
                onClick={handleLogout}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <i className="fa-regular fa-circle-user" />
                <span>Salir</span>
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`app-btn ${isActiveAny(["/register"]) ? "is-active" : ""}`}
                  title="Registro"
                  aria-label="Registro"
                >
                  <i className="fa-solid fa-user-plus" />
                  <span>Registro</span>
                </Link>
                <button
                  className="app-btn"
                  onClick={() => setShowLogin(true)}
                  title="Iniciar sesión"
                  aria-label="Iniciar sesión"
                >
                  <i className="fa-solid fa-right-to-bracket" />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Dock inferior móvil */}
      <div
        className="dock d-md-none bg-black d-flex justify-content-around py-2"
        role="navigation"
        aria-label="Mobile dock"
      >
        <Link
          to="/people"
          className={`app-btn ${isActiveAny(["/people"]) ? "is-active" : ""}`}
          title="People"
          aria-label="People"
        >
          <i className="fa-regular fa-user" />
        </Link>

        <Link
          to="/planets"
          className={`app-btn ${isActiveAny(["/planets"]) ? "is-active" : ""}`}
          title="Planets"
          aria-label="Planets"
        >
          <i className="fa-solid fa-globe" />
        </Link>

        <Link
          to="/vehicles"
          className={`app-btn ${isActiveAny(["/vehicles"]) ? "is-active" : ""}`}
          title="Vehicles"
          aria-label="Vehicles"
        >
          <i className="fa-solid fa-shuttle-space" />
        </Link>

        {isAuthed ? (
          <>
            <button
              className={`app-btn ${isActiveAny(["/favorites"]) ? "is-active" : ""}`}
              onClick={handleFavoritesClick}
              title="Favoritos"
              aria-label="Favoritos"
            >
              <i className="fa-regular fa-star" />
            </button>

            <button
              className="app-btn"
              onClick={handleLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <i className="fa-regular fa-circle-user" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={`app-btn ${isActiveAny(["/register"]) ? "is-active" : ""}`}
              title="Registro"
              aria-label="Registro"
            >
              <i className="fa-solid fa-user-plus" />
            </Link>
            <button
              className="app-btn"
              onClick={() => setShowLogin(true)}
              title="Login"
              aria-label="Login"
            >
              <i className="fa-solid fa-right-to-bracket" />
            </button>
          </>
        )}
      </div>

      {/* Modal Login */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};
