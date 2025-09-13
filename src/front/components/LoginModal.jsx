// src/components/LoginModal.jsx
// MODO SIMULACIÓN FRONTEND — SIN BACKEND
// ----------------------------------------------------

import { useState } from "react";

export const LoginModal = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // No validamos nada real, solo simulamos éxito
    // En una app real aquí iría la llamada al backend
    if (email && password) {
      onSuccess(); // Navbar guardará un token falso
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title">Iniciar sesión</h5>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
