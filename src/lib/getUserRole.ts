export function getUserRole() {
  if (globalThis.window === undefined) return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role; // aqui está a role
  } catch {
    return null;
  }
}