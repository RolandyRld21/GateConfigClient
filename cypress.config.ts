// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://gateconfigserver.onrender.com/api",
    setupNodeEvents(on, config) {
      
    },
  },
});
