// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoginModal } from "./LoginModal";

export const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem("access_token")));
  }, [showLogin, location.pathname]);

  const handleLoginSuccess = () => {
    localStorage.setItem("access_token", "fake-token");
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
      <nav className="navbar bg-black">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="d-inline-flex align-items-center">
            <img src="/logo.png" alt="Logo" className="brand-logo" />
          </Link>

          {/* Desktop: botones */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <Link
              to="/people"
              className={`app-btn ${isActiveAny(["/people"]) ? "is-active" : ""}`}
              title="People"
            >
              <i className="fa-regular fa-user" />
              <span>People</span>
            </Link>

            <Link
              to="/planetes"
              className={`app-btn ${isActiveAny(["/planetes"]) ? "is-active" : ""}`}
              title="Planetes"
            >
              <i className="fa-solid fa-globe" />
              <span>Planetes</span>
            </Link>

            {isAuthed && (
              <>
                <Link
                  to="/contacts"
                  className={`app-btn ${isActiveAny(["/contacts"]) ? "is-active" : ""}`}
                  title="Contacts"
                >
                  <i className="fa-regular fa-address-book" />
                  <span>Contacts</span>
                </Link>

                <button
                  className={`app-btn ${isActiveAny(["/favorites"]) ? "is-active" : ""}`}
                  onClick={handleFavoritesClick}
                  title="Favoritos"
                >
                  <i className="fa-regular fa-star" />
                  <span>Favoritos</span>
                </button>
              </>
            )}

            {isAuthed ? (
              <button className="app-btn" onClick={handleLogout} title="Cerrar sesión">
                <i className="fa-regular fa-circle-user" />
                <span>Salir</span>
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`app-btn ${isActiveAny(["/register"]) ? "is-active" : ""}`}
                  title="Registro"
                >
                  <i className="fa-solid fa-user-plus" />
                  <span>Registro</span>
                </Link>
                <button
                  className="app-btn"
                  onClick={() => setShowLogin(true)}
                  title="Iniciar sesión"
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
      <div className="dock d-md-none bg-black d-flex justify-content-around">
        <Link
          to="/people"
          className={`app-btn ${isActiveAny(["/people"]) ? "is-active" : ""}`}
          title="People"
        >
          <i className="fa-regular fa-user" />
        </Link>
        <Link
          to="/planetes"
          className={`app-btn ${isActiveAny(["/planetes"]) ? "is-active" : ""}`}
          title="Planetes"
        >
          <i className="fa-solid fa-globe" />
        </Link>

        {isAuthed ? (
          <>
            <button
              className={`app-btn ${isActiveAny(["/favorites"]) ? "is-active" : ""}`}
              onClick={handleFavoritesClick}
              title="Favoritos"
            >
              <i className="fa-regular fa-star" />
            </button>
            <Link
              to="/contacts"
              className={`app-btn ${isActiveAny(["/contacts"]) ? "is-active" : ""}`}
              title="Contacts"
            >
              <i className="fa-regular fa-address-book" />
            </Link>
            <button className="app-btn" onClick={handleLogout} title="Cerrar sesión">
              <i className="fa-regular fa-circle-user" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={`app-btn ${isActiveAny(["/register"]) ? "is-active" : ""}`}
              title="Registro"
            >
              <i className="fa-solid fa-user-plus" />
            </Link>
            <button className="app-btn" onClick={() => setShowLogin(true)} title="Login">
              <i className="fa-solid fa-right-to-bracket" />
            </button>
          </>
        )}
      </div>

      {/* Modal Login (simulado) */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};
