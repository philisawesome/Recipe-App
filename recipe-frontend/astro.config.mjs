import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
/*
redirects: {
	'/index': '/', // todo: replace index with / in source code
},
*/
export default defineConfig({
	integrations: [react({include:["**/app/**"]})],
	site: "https://stovetop.cc",
	publicDir: "./src/assets",
	build: {
		inlineStylesheets: 'always',
		format: 'file',
	},
	vite: {
		plugins: [tailwindcss()],
	},
	env: {
		schema: {
		  API_URL: envField.string({ context: "client", access: "public", optional: true, default: "yooooo" }),
		}
  	}
});
