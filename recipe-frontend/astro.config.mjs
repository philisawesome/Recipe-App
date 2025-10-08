import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	integrations: [react({include:["**/app/**"]})],
	site: "https://stovetop-recipe-app.s3.us-west-1.amazonaws.com/",
	publicDir: "./src/assets",
	build: {
		inlineStylesheets: 'always',
		format: 'file',
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
