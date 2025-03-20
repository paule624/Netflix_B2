import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tailwindcss from "@tailwindcss/vite";

// Charger les variables d'environnement
dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
