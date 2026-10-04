import { expect, test } from "@playwright/test"

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 1000 },
]

async function prepareStableScreenshot(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  })

  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

for (const viewport of viewports) {
  test(`homepage visual baseline at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })

    await page.goto("/", { waitUntil: "networkidle" })
    await prepareStableScreenshot(page)
    await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
      fullPage: true,
    })
  })
}
