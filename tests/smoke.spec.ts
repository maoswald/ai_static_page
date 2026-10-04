import { expect, test } from "@playwright/test"

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 1000 },
]

function assertAbsoluteHttpUrl(value: string | null) {
  expect(value).toBeTruthy()
  const url = new URL(value!)
  expect(["http:", "https:"]).toContain(url.protocol)
}

test("homepage renders the main sections", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "networkidle" })

  expect(response?.ok()).toBeTruthy()
  await expect(
    page.getByRole("heading", {
      name: /Enterprise Transformation,\s*Technology Strategy\s*and AI & Cloud/i,
    }),
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "Focus Areas" })).toBeVisible()
  await expect(page.getByText("Beyond Work")).toBeVisible()
  await expect(page.getByText("About Me")).toBeVisible()
})

test("footer links are valid and internal pages load", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" })

  const linkedIn = page.getByRole("link", { name: "LinkedIn profile" })
  const email = page.getByRole("link", { name: "Send email" })
  const thirdSocialLink = page
    .getByRole("navigation", { name: "Social and contact links" })
    .getByRole("link")
    .nth(2)

  assertAbsoluteHttpUrl(await linkedIn.getAttribute("href"))
  expect(await email.getAttribute("href")).toMatch(/^mailto:/)
  expect(await thirdSocialLink.getAttribute("href")).toMatch(/^mailto:/)

  await page.getByRole("link", { name: "Imprint" }).click()
  await expect(page).toHaveURL(/\/imprint\.html$/)
  await expect(page.getByRole("heading", { name: "Imprint" })).toBeVisible()

  await page.goto("/", { waitUntil: "networkidle" })
  await page.getByRole("link", { name: "Privacy" }).click()
  await expect(page).toHaveURL(/\/privacy\.html$/)
  await expect(
    page.getByRole("heading", { name: "Privacy Policy" }),
  ).toBeVisible()
})

for (const viewport of viewports) {
  test(`homepage has no horizontal overflow at ${viewport.name} viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })
    await page.goto("/", { waitUntil: "networkidle" })

    await expect(page.locator("main")).toBeVisible()
    await expect(
      page.getByRole("heading", {
        name: /Enterprise Transformation,\s*Technology Strategy\s*and AI & Cloud/i,
      }),
    ).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
      dimensions.clientWidth + 1,
    )
  })
}

test("core content and legal navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  try {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" })
    expect(response?.ok()).toBeTruthy()

    await expect(
      page.getByRole("heading", {
        name: /Enterprise Transformation, Technology Strategy and AI & Cloud/i,
      }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Focus Areas" }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: "Imprint" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible()

    await page.getByRole("link", { name: "Privacy" }).click()
    await expect(page).toHaveURL(/\/privacy\.html$/)
    await expect(
      page.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeVisible()
  } finally {
    await context.close()
  }
})

test("footer icon links are keyboard focusable and expose focus and hover states", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" })

  const socialLinks = page
    .getByRole("navigation", { name: "Social and contact links" })
    .getByRole("link")

  await expect(socialLinks).toHaveCount(3)

  for (const link of await socialLinks.all()) {
    await expect(link).toHaveAccessibleName(/.+/)
    await link.focus()
    await expect(link).toBeFocused()

    const outlineStyle = await link.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    )
    expect(outlineStyle).not.toBe("none")
  }

  const linkedIn = page.getByRole("link", { name: "LinkedIn profile" })
  const backgroundBeforeHover = await linkedIn.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  )
  await linkedIn.hover()

  await expect
    .poll(() =>
      linkedIn.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(backgroundBeforeHover)
})

test("static internal pages respond successfully", async ({ page }) => {
  for (const path of ["/privacy.html", "/imprint.html", "/404.html"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" })
    expect(response?.ok()).toBeTruthy()
  }
})

test("404 page renders, stays noindex, links home, and avoids mobile overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const response = await page.goto("/404.html", {
    waitUntil: "domcontentloaded",
  })

  expect(response?.ok()).toBeTruthy()
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
  await expect(page.getByText("Page not found.")).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  )

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)

  await page.getByRole("link", { name: /Return home/i }).click()
  await expect(page).toHaveURL("/")
  await expect(
    page.getByRole("heading", {
      name: /Enterprise Transformation,\s*Technology Strategy\s*and AI & Cloud/i,
    }),
  ).toBeVisible()
})
