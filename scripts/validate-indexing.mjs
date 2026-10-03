import { existsSync, readFileSync } from "node:fs"
import { basename, join } from "node:path"

const productionOrigin = "https://manueloswald.com"
const distDir = "dist"

function fail(message) {
  console.error(message)
  process.exit(1)
}

function readDist(path) {
  const filePath = join(distDir, path)
  if (!existsSync(filePath)) {
    fail(`${path} is missing from ${distDir}.`)
  }
  return readFileSync(filePath, "utf8")
}

function decodeHtmlAttribute(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))
  return match ? decodeHtmlAttribute(match[1]) : undefined
}

function getTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(
    (match) => match[0],
  )
}

function getMetaContent(html, name) {
  return getTags(html, "meta")
    .filter((tag) => getAttribute(tag, "name") === name)
    .map((tag) => getAttribute(tag, "content") ?? "")
}

function getCanonicalUrls(html) {
  return getTags(html, "link")
    .filter((tag) => getAttribute(tag, "rel") === "canonical")
    .map((tag) => getAttribute(tag, "href") ?? "")
}

function assertAbsoluteProductionUrl(url, label) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    fail(`${label} is not a valid absolute URL: ${url}`)
  }

  if (parsed.origin !== productionOrigin) {
    fail(`${label} must use ${productionOrigin}: ${url}`)
  }

  if (parsed.protocol !== "https:") {
    fail(`${label} must use HTTPS: ${url}`)
  }
}

const robots = readDist("robots.txt")
if (!/^User-agent:\s*\*/im.test(robots)) {
  fail("robots.txt must define a rule for all crawlers.")
}
if (/^Disallow:\s*\/\s*$/im.test(robots)) {
  fail("robots.txt blocks the whole site.")
}
if (!robots.includes(`Sitemap: ${productionOrigin}/sitemap.xml`)) {
  fail("robots.txt must reference the production sitemap.")
}

const sitemap = readDist("sitemap.xml")
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
)
if (sitemapUrls.length === 0) {
  fail("sitemap.xml must contain at least one URL.")
}
sitemapUrls.forEach((url) => assertAbsoluteProductionUrl(url, "sitemap URL"))
if (!sitemapUrls.includes(`${productionOrigin}/`)) {
  fail("sitemap.xml must include the homepage.")
}
;["imprint.html", "privacy.html", "404.html"].forEach((path) => {
  if (sitemapUrls.some((url) => url.endsWith(`/${path}`))) {
    fail(`sitemap.xml must not include noindex page ${path}.`)
  }
})

const htmlFiles = ["index.html", "imprint.html", "privacy.html", "404.html"]
const expectedCanonical = {
  "index.html": `${productionOrigin}/`,
  "imprint.html": `${productionOrigin}/imprint.html`,
  "privacy.html": `${productionOrigin}/privacy.html`,
  "404.html": `${productionOrigin}/404.html`,
}
const expectedNoindex = new Set(["imprint.html", "privacy.html", "404.html"])

htmlFiles.forEach((path) => {
  const html = readDist(path)
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()
  if (!title) {
    fail(`${path} must have a title.`)
  }

  const descriptions = getMetaContent(html, "description")
  if (descriptions.length !== 1 || !descriptions[0].trim()) {
    fail(`${path} must have exactly one meta description.`)
  }

  const canonicals = getCanonicalUrls(html)
  if (canonicals.length !== 1) {
    fail(`${path} must have exactly one canonical URL.`)
  }
  if (canonicals[0] !== expectedCanonical[path]) {
    fail(`${path} has unexpected canonical URL: ${canonicals[0]}`)
  }
  assertAbsoluteProductionUrl(canonicals[0], `${path} canonical URL`)

  const robotsDirectives = getMetaContent(html, "robots")
  const hasNoindex = robotsDirectives.some((content) =>
    content
      .toLowerCase()
      .split(",")
      .map((item) => item.trim())
      .includes("noindex"),
  )
  if (expectedNoindex.has(path) && !hasNoindex) {
    fail(`${path} must be noindex.`)
  }
  if (!expectedNoindex.has(path) && hasNoindex) {
    fail(`${path} must be indexable.`)
  }
})

const productionText = [
  robots,
  sitemap,
  ...htmlFiles.map((path) => readDist(path)),
].join("\n")

if (/localhost|127\.0\.0\.1|github\.io/i.test(productionText)) {
  fail("Production output contains localhost, 127.0.0.1, or github.io URLs.")
}

console.log("Search indexing validation passed.")
