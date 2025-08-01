import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
  host: "::",
  port: 8080,
  proxy: {
  '/api/superhero': {
    target: 'https://superheroapi.com/api.php/11f01a579d44c5255bc4fe1ec0fc3792',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/superhero/, ''),
    },
  },
},
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
