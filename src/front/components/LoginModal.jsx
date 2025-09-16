// src/front/components/LoginModal.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apiLogin, apiGetMe } from "../services/apiAuth";

export const LoginModal = ({ onClose, onSuccess }) => {
  const { dispatch, types } = useGlobalReducer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const { token } = await apiLogin({ email, password });
      localStorage.setItem("access_token", token);
      dispatch({ type: types.SET_AUTH, payload: { token } });

      try {
        const me = await apiGetMe(token);
        dispatch({ type: types.SET_USER, payload: me });
      } catch {}

      onSuccess?.(token);
      onClose?.();
    } catch (err) {
      setMsg(err.message || "No se pudo iniciar sesión");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop app-modal-backdrop" role="dialog" aria-modal="true">
      <div className="app-modal">
        <button className="app-modal__close" onClick={onClose} aria-label="Cerrar">
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="app-modal__header">
          <h5 className="m-0">
            <i className="fa-regular fa-circle-user me-2" />
            Iniciar sesión
          </h5>
        </div>

        <div className="app-modal__body">
          {msg && <div className="alert alert-danger py-2">{msg}</div>}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
              />
            </div>

            <div>
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={busy}
              />
            </div>

            <button type="submit" className="app-btn block" disabled={busy}>
              {busy ? "Entrando…" : "Login"}
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-white">¿No tienes cuenta?</span>{" "}
            <Link to="/register" onClick={onClose} className="link-accent">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
