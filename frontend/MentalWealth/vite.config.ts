import { ConfigEnv, defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
    process.env = { ...process.env, ...loadEnv(mode.mode, process.cwd()) };

    return {
        plugins: [react(), splitVendorChunkPlugin()],
        server: {
            proxy: {
                "/api": {
                    target: process.env.VITE_BACKEND_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },
        define: {
            global: "globalThis",
        }
    };
});
