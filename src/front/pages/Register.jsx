// src/front/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apiRegister, apiLogin, apiGetMe } from "../services/apiAuth";

export const Register = () => {
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
      await apiRegister({ email, password });
      const { token } = await apiLogin({ email, password });
      localStorage.setItem("access_token", token);
      dispatch({ type: types.SET_AUTH, payload: { token } });

      try {
        const me = await apiGetMe(token);
        dispatch({ type: types.SET_USER, payload: me });
      } catch {}

      setMsg("Cuenta creada y sesión iniciada.");
    } catch (err) {
      setMsg(err.message || "No se pudo crear la cuenta");
    } finally {
      setBusy(false);
    }
  };

  const openLoginModal = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("openLoginModal"));
  };

  return (
    <div className="container section d-flex justify-content-center">
      <div className="app-card form-card">
        <div className="d-flex align-items-center mb-3">
          <i className="fa-solid fa-user-plus me-2" />
          <h5 className="m-0">Crear cuenta</h5>
        </div>

        {msg && (
          <div className={`alert ${msg.startsWith("Cuenta creada") ? "alert-success" : "alert-danger"} py-2`}>
            {msg}
          </div>
        )}

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
            {busy ? "Creando…" : "Registrarme"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-white">¿Ya tienes cuenta?</span>{" "}
          <Link to="#" onClick={openLoginModal} className="link-accent">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
