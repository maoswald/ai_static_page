import { readFileSync } from "node:fs"

const html = readFileSync("dist/index.html", "utf8")
const expectedSocialImage = "https://manueloswald.com/social-image.png"
const expectedSocialImageAlt =
  "Manuel Oswald — Enterprise Transformation, Technology Strategy and AI & Cloud"
const jsonLdBlocks = [
  ...html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ),
].map((match) => match[1].trim())

function fail(message) {
  console.error(message)
  process.exit(1)
}

function hasKeyDeep(value, key) {
  if (!value || typeof value !== "object") return false
  if (Object.prototype.hasOwnProperty.call(value, key)) return true
  return Object.values(value).some((child) => hasKeyDeep(child, key))
}

function assertAbsoluteUrl(value, label) {
  let url
  try {
    url = new URL(value)
  } catch {
    fail(`${label} is not a valid absolute URL: ${value}`)
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    fail(`${label} must use http or https: ${value}`)
  }
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

function findMetaContent(attributeName, attributeValue) {
  const matches = [...html.matchAll(/<meta\b[^>]*>/gi)].filter(
    (match) => getAttribute(match[0], attributeName) === attributeValue,
  )

  if (matches.length !== 1) {
    fail(
      `Expected exactly one meta ${attributeName}="${attributeValue}", found ${matches.length}.`,
    )
  }

  return getAttribute(matches[0][0], "content")
}

const parsedBlocks = jsonLdBlocks.map((block, index) => {
  try {
    return JSON.parse(block)
  } catch (error) {
    fail(`JSON-LD block ${index + 1} does not parse: ${error.message}`)
  }
})

const personBlocks = parsedBlocks.filter((block) => block["@type"] === "Person")

if (personBlocks.length !== 1) {
  fail(
    `Expected exactly one Person JSON-LD block, found ${personBlocks.length}.`,
  )
}

const person = personBlocks[0]

if (person["@context"] !== "https://schema.org") {
  fail(`Unexpected @context: ${person["@context"]}`)
}

if (person.name !== "Manuel Oswald") {
  fail(`Unexpected name: ${person.name}`)
}

if (person.url !== "https://manueloswald.com") {
  fail(`Unexpected url: ${person.url}`)
}

if (person.image !== expectedSocialImage) {
  fail(`Unexpected image: ${person.image}`)
}

assertAbsoluteUrl(person.image, "image")

if (!Array.isArray(person.sameAs)) {
  fail("sameAs must be an array.")
}

person.sameAs.forEach((url, index) => {
  if (typeof url !== "string") {
    fail(`sameAs[${index}] must be a string.`)
  }
  assertAbsoluteUrl(url, `sameAs[${index}]`)
})

const expectedMeta = [
  ["property", "og:image", expectedSocialImage],
  ["property", "og:image:width", "1200"],
  ["property", "og:image:height", "630"],
  ["property", "og:image:alt", expectedSocialImageAlt],
  ["name", "twitter:card", "summary_large_image"],
  ["name", "twitter:image", expectedSocialImage],
  ["name", "twitter:image:alt", expectedSocialImageAlt],
]

expectedMeta.forEach(([attributeName, attributeValue, expectedContent]) => {
  const content = findMetaContent(attributeName, attributeValue)
  if (content !== expectedContent) {
    fail(
      `Unexpected content for ${attributeName}="${attributeValue}": ${content}`,
    )
  }
})
;[
  "address",
  "telephone",
  "birthDate",
  "familyName",
  "givenName",
  "parent",
  "children",
  "sibling",
  "spouse",
  "worksFor",
  "affiliation",
].forEach((key) => {
  if (hasKeyDeep(person, key)) {
    fail(`Private or excluded property found in Person JSON-LD: ${key}`)
  }
})

console.log("Person JSON-LD validation passed.")
