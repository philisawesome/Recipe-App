import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
 server: {
    // Required for Docker or public network access
    host: '0.0.0.0', 
    hmr: {
      host: 'localhost', // or your specific domain name (e.g., 'yourdomainname.com')
      protocol: 'ws',    // Fall back to standard WebSockets if using HTTPS locally or with proxies
    },
  },
});
