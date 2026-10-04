import { readFileSync } from "node:fs"

const manifest = JSON.parse(readFileSync(".lighthouseci/manifest.json", "utf8"))
const representativeRuns = manifest.filter((run) => run.isRepresentativeRun)

const thresholds = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.95,
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function formatScore(score) {
  return Math.round(score * 100)
}

for (const run of representativeRuns) {
  for (const [category, threshold] of Object.entries(thresholds)) {
    const score = run.summary[category]
    if (score < threshold) {
      fail(
        `${run.url} ${category} score ${formatScore(score)} is below ${formatScore(threshold)}.`,
      )
    }
  }

  if (run.url.endsWith(":4173/") && run.summary.seo < 0.95) {
    fail(`${run.url} seo score ${formatScore(run.summary.seo)} is below 95.`)
  }
}

console.log("Lighthouse score validation passed.")
