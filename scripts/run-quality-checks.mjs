import { spawn } from "node:child_process"
import { request } from "node:http"

const mode = process.argv[2] ?? "all"
const allowedModes = new Set([
  "all",
  "standard",
  "lighthouse",
  "a11y",
  "smoke",
  "visual",
])
const baseUrl = process.env.QUALITY_BASE_URL ?? "http://127.0.0.1:4173"

if (!allowedModes.has(mode)) {
  console.error(
    "Usage: node scripts/run-quality-checks.mjs [all|standard|lighthouse|a11y|smoke|visual]",
  )
  process.exit(1)
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    })

    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(" ")} exited with ${code}`))
      }
    })
  })
}

function waitForUrl(url, timeoutMs = 30000) {
  const startedAt = Date.now()

  return new Promise((resolve, reject) => {
    function attempt() {
      const req = request(url, { method: "HEAD" }, (res) => {
        res.resume()
        if (res.statusCode && res.statusCode < 500) {
          resolve()
        } else {
          retry()
        }
      })

      req.on("error", retry)
      req.end()
    }

    function retry() {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`))
      } else {
        setTimeout(attempt, 250)
      }
    }

    attempt()
  })
}

const server = spawn(
  "pnpm",
  [
    "exec",
    "vite",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
    "--strictPort",
  ],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
)

let serverExited = false
server.on("exit", (code) => {
  serverExited = true
  if (code !== 0 && code !== null) {
    console.error(`Preview server exited with ${code}`)
  }
})

async function stopServer() {
  if (!serverExited) {
    server.kill("SIGTERM")
  }
}

try {
  await waitForUrl(baseUrl)

  if (mode === "all" || mode === "lighthouse") {
    await run("pnpm", ["exec", "lhci", "autorun"])
    await run("node", ["scripts/validate-lighthouse.mjs"])
  }

  if (mode === "visual") {
    await run("pnpm", ["exec", "playwright", "test", "tests/visual.spec.ts"], {
      env: { ...process.env, QUALITY_BASE_URL: baseUrl },
    })
  }

  if (["all", "standard", "a11y", "smoke"].includes(mode)) {
    const testFiles = {
      all: [],
      standard: ["tests/accessibility.spec.ts", "tests/smoke.spec.ts"],
      a11y: ["tests/accessibility.spec.ts"],
      smoke: ["tests/smoke.spec.ts"],
    }[mode]

    await run("pnpm", ["exec", "playwright", "test", ...testFiles], {
      env: { ...process.env, QUALITY_BASE_URL: baseUrl },
    })
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  await stopServer()
}
