import { useState } from "react";

export const LoginForm = ({ onSuccess }) => {
  const BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Credenciales inválidas");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      onSuccess?.(data.access_token);
    } catch {
      setError("Error de red. Revisa tu conexión.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <div>
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            placeholder="tuemail@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="********"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-warning w-100" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
};
