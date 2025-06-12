// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://192.168.1.149:5173", // <- IP-ul local, nu localhost!
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
