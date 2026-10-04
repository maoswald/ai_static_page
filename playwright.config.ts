import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  reporter: [["list"]],
  use: {
    baseURL: process.env.QUALITY_BASE_URL ?? "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },
  workers: 1,
})
