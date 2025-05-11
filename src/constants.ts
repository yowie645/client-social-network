// constants.ts
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://express-api-social-network.onrender.com"
    : "http://localhost:3000")
