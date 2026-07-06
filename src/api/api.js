export const DUONG_DAN_API = "http://localhost:4000";

export function layToken() {
  return localStorage.getItem("token");
}

export function taoHeaderCoToken() {
  return {
    Authorization: `Bearer ${layToken()}`,
  };
}