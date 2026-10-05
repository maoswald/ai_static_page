import { spawn } from "node:child_process"

const mode = process.argv[2] ?? "normal"
const allowedModes = new Set(["normal", "static", "full"])

if (!allowedModes.has(mode)) {
  console.error("Usage: node scripts/verify.mjs [normal|static|full]")
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

async function runScript(name, ...args) {
  await run("pnpm", ["run", name, ...args])
}

async function validateStaticOutput() {
  await runScript("validate:indexing")
  await runScript("validate:jsonld")
  await runScript("validate:links")

  const analyticsMode = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim()
    ? "present"
    : "absent"

  await runScript("validate:analytics", "--", analyticsMode)
}

try {
  await runScript("format:check")
  await runScript("build")
  await validateStaticOutput()

  if (mode === "normal") {
    await runScript("quality:standard")
  }

  if (mode === "full") {
    await runScript("quality")
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
