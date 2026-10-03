import { readFileSync } from "node:fs"

const html = readFileSync("dist/index.html", "utf8")
const expectedState = process.argv.slice(2).filter((arg) => arg !== "--")[0]

if (expectedState !== "present" && expectedState !== "absent") {
  console.error("Usage: node scripts/validate-analytics.mjs <present|absent>")
  process.exit(1)
}

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

const beacons = [...html.matchAll(/<script\b[^>]*>/gi)].filter(
  (match) =>
    getAttribute(match[0], "src") ===
    "https://static.cloudflareinsights.com/beacon.min.js",
)

if (expectedState === "absent") {
  if (beacons.length !== 0) {
    fail(`Expected no Cloudflare Web Analytics beacon, found ${beacons.length}.`)
  }

  console.log("Cloudflare Web Analytics beacon is absent.")
  process.exit(0)
}

if (beacons.length !== 1) {
  fail(`Expected one Cloudflare Web Analytics beacon, found ${beacons.length}.`)
}

const beacon = beacons[0][0]

if (!/\bdefer(?:\s|=|>|$)/i.test(beacon)) {
  fail("Cloudflare Web Analytics beacon must use defer.")
}

const beaconConfig = getAttribute(beacon, "data-cf-beacon")

if (!beaconConfig) {
  fail("Cloudflare Web Analytics beacon is missing data-cf-beacon.")
}

let parsedConfig
try {
  parsedConfig = JSON.parse(beaconConfig)
} catch (error) {
  fail(`Cloudflare Web Analytics data-cf-beacon is invalid JSON: ${error.message}`)
}

if (!parsedConfig.token || typeof parsedConfig.token !== "string") {
  fail("Cloudflare Web Analytics token must be a non-empty string.")
}

console.log("Cloudflare Web Analytics beacon validation passed.")
