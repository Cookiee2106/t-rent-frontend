export const DUONG_DAN_API =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function layToken() {
  return localStorage.getItem("token");
}

export function taoHeaderCoToken() {
  const token = layToken();

  if (!token || token === "undefined" || token === "null") {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}