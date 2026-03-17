export function isAuthenticated() {
  if (globalThis.window === undefined) return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }

    return !isExpired;
  } catch (err) {
    console.error(err);
    return false;
  }
}