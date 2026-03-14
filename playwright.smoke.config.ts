import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "smoke.spec.ts",
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "off",
  },
  webServer: {
    command: "npx serve out -p 3001",
    port: 3001,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
