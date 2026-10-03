import { readFileSync } from "node:fs"

const html = readFileSync("dist/index.html", "utf8")
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

if (!Array.isArray(person.sameAs)) {
  fail("sameAs must be an array.")
}

person.sameAs.forEach((url, index) => {
  if (typeof url !== "string") {
    fail(`sameAs[${index}] must be a string.`)
  }
  assertAbsoluteUrl(url, `sameAs[${index}]`)
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
