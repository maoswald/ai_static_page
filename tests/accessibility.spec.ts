import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const pages = [
  { path: "/", title: "Homepage" },
  { path: "/privacy.html", title: "Privacy page" },
  { path: "/imprint.html", title: "Imprint page" },
]

test.describe("accessibility", () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.title} has no obvious accessibility violations`, async ({
      page,
    }) => {
      await page.goto(pageInfo.path, { waitUntil: "networkidle" })

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

      expect(results.violations).toEqual([])
    })

    test(`${pageInfo.title} has a usable heading outline`, async ({ page }) => {
      await page.goto(pageInfo.path, { waitUntil: "networkidle" })

      const headings = await page.getByRole("heading").evaluateAll((elements) =>
        elements.map((element) => ({
          level: Number(element.tagName.slice(1)),
          text: element.textContent?.trim() ?? "",
        })),
      )

      expect(headings.filter((heading) => heading.level === 1)).toHaveLength(1)

      for (let index = 1; index < headings.length; index += 1) {
        const previous = headings[index - 1]
        const current = headings[index]
        expect(
          current.level <= previous.level + 1,
          `Heading "${current.text}" skips from h${previous.level} to h${current.level}`,
        ).toBeTruthy()
      }
    })
  }
})
