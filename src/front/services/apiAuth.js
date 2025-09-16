// src/front/services/apiAuth.js
export async function apiRegister({ email, password }) {
  const base = import.meta.env.VITE_BACKEND_URL || "";
  const res = await fetch(`${base}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.msg || "No se pudo registrar");
  return data; // user serializado
}

export async function apiLogin({ email, password }) {
  const base = import.meta.env.VITE_BACKEND_URL || "";
  const res = await fetch(`${base}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.msg || "Credenciales inválidas");
  return data; // { msg, token }
}

export async function apiGetMe(token) {
  const base = import.meta.env.VITE_BACKEND_URL || "";
  const res = await fetch(`${base}/api/users`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.msg || "No se pudo cargar el usuario");
  return data; // user serializado
}
