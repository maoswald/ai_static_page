import { spawn } from "node:child_process"
import { request } from "node:http"

const mode = process.argv[2] ?? "all"
const allowedModes = new Set(["all", "lighthouse", "a11y"])
const baseUrl = process.env.QUALITY_BASE_URL ?? "http://127.0.0.1:4173"

if (!allowedModes.has(mode)) {
  console.error(
    "Usage: node scripts/run-quality-checks.mjs [all|lighthouse|a11y]",
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

  if (mode === "all" || mode === "a11y") {
    const testArgs =
      mode === "a11y"
        ? ["exec", "playwright", "test", "tests/accessibility.spec.ts"]
        : ["exec", "playwright", "test"]

    await run("pnpm", testArgs, {
      env: { ...process.env, QUALITY_BASE_URL: baseUrl },
    })
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  await stopServer()
}
