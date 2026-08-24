import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    vinext(),
    // Nitro creates the Vercel production server bundle. Keeping it out of
    // development prevents it from replacing Vinext's RSC dev environment.
    ...(command === "build" ? [nitro()] : []),
  ],
}));
