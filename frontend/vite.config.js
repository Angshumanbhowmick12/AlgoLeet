import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from "path"; // Ensure path is imported

// Helper function to get __dirname equivalent in ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            // Use the __dirname equivalent to resolve the path correctly
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
