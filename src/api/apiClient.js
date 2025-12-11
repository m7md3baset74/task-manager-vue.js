import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://kbybdtacoqvgcijrkzkv.supabase.co/rest/v1",
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  },
  timeout: 15000
});

export default apiClient;
