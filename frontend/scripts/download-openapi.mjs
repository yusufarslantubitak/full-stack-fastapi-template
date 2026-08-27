import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env if present and environment variables are not set
const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...values] = trimmed.split('=')
    if (key && !process.env[key]) {
      process.env[key] = values.join('=')
    }
  }
}

const targetPath = path.resolve(__dirname, '../openapi.json')

const url =
  process.argv[2] ||
  process.env.OPENAPI_URL ||
  (process.env.VITE_API_URL
    ? `${process.env.VITE_API_URL.replace(/\/$/, '')}/api/v1/openapi.json`
    : null)

if (!url) {
  console.error(
    '✗ Error: OpenAPI URL is not defined. Please set OPENAPI_URL, VITE_API_URL in .env, or pass the URL as an argument.',
  )
  process.exit(1)
}

async function downloadOpenApi(targetUrl) {
  console.log(`Fetching OpenAPI schema from: ${targetUrl}`)
  try {
    const response = await fetch(targetUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const schema = await response.json()
    fs.writeFileSync(targetPath, JSON.stringify(schema, null, 2), 'utf8')
    console.log(`✓ Successfully downloaded OpenAPI schema to ${targetPath}`)
  } catch (error) {
    console.error(
      `✗ Failed to download OpenAPI schema from ${targetUrl}: ${error.message}`,
    )
    process.exit(1)
  }
}

downloadOpenApi(url)
