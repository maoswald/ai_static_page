import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { extname, join, posix, relative, sep } from "node:path"

const distDir = "dist"
const productionOrigin = "https://manueloswald.com"
const htmlExtensions = new Set([".html"])
const fileExtensions = new Set([
  ".css",
  ".html",
  ".ico",
  ".js",
  ".json",
  ".png",
  ".svg",
  ".txt",
  ".xml",
])

function fail(message) {
  console.error(message)
  process.exit(1)
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

function toPosixPath(path) {
  return path.split(sep).join("/")
}

function walkFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walkFiles(path) : [path]
  })
}

function readDist(path) {
  const filePath = join(distDir, path)
  if (!existsSync(filePath)) {
    fail(`${path} is missing from ${distDir}.`)
  }
  return readFileSync(filePath, "utf8")
}

function readProjectFile(path) {
  if (!existsSync(path)) {
    fail(`${path} is missing.`)
  }
  return readFileSync(path, "utf8")
}

function isSkippedLink(value) {
  return (
    !value ||
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("javascript:")
  )
}

function normalizeInternalPath(urlPath) {
  let pathname = urlPath
  try {
    pathname = decodeURI(pathname)
  } catch {
    fail(`Internal URL path is not valid URI encoding: ${urlPath}`)
  }

  if (pathname === "" || pathname === "/") return "index.html"
  if (pathname.endsWith("/")) return `${pathname.slice(1)}index.html`
  return pathname.replace(/^\//, "")
}

function pathExistsForUrl(urlPath) {
  const normalized = normalizeInternalPath(urlPath)
  if (existsSync(join(distDir, normalized))) return true

  if (!fileExtensions.has(extname(normalized))) {
    return existsSync(join(distDir, `${normalized}.html`))
  }

  return false
}

function assertExternalUrl(url, source) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    fail(`${source} has malformed external URL: ${url}`)
  }

  if (parsed.protocol === "mailto:") {
    if (!parsed.pathname || !parsed.pathname.includes("@")) {
      fail(`${source} has invalid mailto link: ${url}`)
    }
    return
  }

  if (parsed.protocol !== "https:") {
    fail(`${source} external URL must use HTTPS: ${url}`)
  }

  if (/localhost|127\.0\.0\.1|github\.io/i.test(url)) {
    fail(
      `${source} external URL must not point to localhost or github.io: ${url}`,
    )
  }

  if (/example\.|placeholder|todo|your-|changeme/i.test(url)) {
    fail(`${source} external URL looks like a placeholder: ${url}`)
  }
}

function validateLink(rawValue, source, currentFile = "index.html") {
  if (isSkippedLink(rawValue)) return

  if (rawValue.startsWith("mailto:")) {
    assertExternalUrl(rawValue, source)
    return
  }

  let parsed
  try {
    parsed = new URL(rawValue, `${productionOrigin}/${currentFile}`)
  } catch {
    fail(`${source} has malformed URL: ${rawValue}`)
  }

  if (parsed.origin === productionOrigin) {
    if (!pathExistsForUrl(parsed.pathname)) {
      fail(`${source} points to missing internal target: ${rawValue}`)
    }
    return
  }

  assertExternalUrl(parsed.href, source)
}

function extractHtmlLinks(html, file) {
  const links = []

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    links.push({ value: getAttribute(match[0], "href"), source: `${file} <a>` })
  }

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    links.push({
      value: getAttribute(match[0], "href"),
      source: `${file} <link>`,
    })
  }

  for (const match of html.matchAll(/<script\b[^>]*>/gi)) {
    links.push({
      value: getAttribute(match[0], "src"),
      source: `${file} <script>`,
    })
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    links.push({
      value: getAttribute(match[0], "src"),
      source: `${file} <img>`,
    })
  }

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const property = getAttribute(match[0], "property")
    const name = getAttribute(match[0], "name")
    if (
      property === "og:url" ||
      property === "og:image" ||
      name === "twitter:image"
    ) {
      links.push({
        value: getAttribute(match[0], "content"),
        source: `${file} <meta ${property ?? name}>`,
      })
    }
  }

  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    let json
    try {
      json = JSON.parse(match[1].trim())
    } catch (error) {
      fail(`${file} JSON-LD does not parse: ${error.message}`)
    }

    for (const key of ["url", "image"]) {
      if (typeof json[key] === "string") {
        links.push({ value: json[key], source: `${file} JSON-LD ${key}` })
      }
    }

    if (Array.isArray(json.sameAs)) {
      json.sameAs.forEach((value, index) => {
        links.push({
          value,
          source: `${file} JSON-LD sameAs[${index}]`,
        })
      })
    }
  }

  return links
}

const htmlFiles = walkFiles(distDir)
  .map((filePath) => toPosixPath(relative(distDir, filePath)))
  .filter((filePath) => htmlExtensions.has(extname(filePath)))

let checkedLinks = 0

for (const file of htmlFiles) {
  const html = readDist(file)
  for (const link of extractHtmlLinks(html, file)) {
    validateLink(link.value, link.source, file)
    checkedLinks += 1
  }
}

const robots = readDist("robots.txt")
for (const match of robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)) {
  validateLink(match[1], "robots.txt Sitemap")
  checkedLinks += 1
}

const sitemap = readDist("sitemap.xml")
for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
  validateLink(match[1], "sitemap.xml <loc>")
  checkedLinks += 1
}

for (const expectedPath of [
  "/",
  "/favicon.svg",
  "/social-image.png",
  "/sitemap.xml",
  "/robots.txt",
]) {
  validateLink(expectedPath, `expected production asset ${expectedPath}`)
  checkedLinks += 1
}

const appSource = readProjectFile("src/App.tsx")
const linksObject = appSource.match(/const links = \{([\s\S]*?)\} as const/)
if (!linksObject) {
  fail("src/App.tsx must define the footer/profile links object.")
}

for (const match of linksObject[1].matchAll(/(\w+):\s*["']([^"']+)["']/g)) {
  validateLink(match[2], `src/App.tsx links.${match[1]}`)
  checkedLinks += 1
}

console.log(`Link validation passed for ${checkedLinks} links.`)
