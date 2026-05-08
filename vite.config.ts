import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { handleDemoBookingEmailRequest } from './server/demoBookingEmailService'
import { getDownloadCacheHeader, getDownloadErrorResponse, getDownloadRedirect, getLatestDownloadsPayload } from './server/downloadReleaseService'
import { getLatestDownloadUrl, getLatestReleaseErrorResponse, getLatestReleaseMetadata } from './server/latestReleaseApiService'

function sendJsonResponse(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function sendRedirectResponse(res: ServerResponse, location: string) {
  res.statusCode = 302
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Location', location)
  res.end()
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (chunks.length === 0) {
    return {}
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return null
  }
}

function demoBookingEmailDevPlugin() {
  return {
    name: 'demo-booking-email-dev-api',
    apply: 'serve' as const,
    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>) => void } }) {
      server.middlewares.use('/api/send-booking-email', async (req, res) => {
        if (req.method !== 'POST') {
          sendJsonResponse(res, 405, { error: 'Method not allowed' })
          return
        }

        const body = await readJsonBody(req)
        if (body === null) {
          sendJsonResponse(res, 400, { error: 'Invalid JSON body' })
          return
        }

        try {
          const result = await handleDemoBookingEmailRequest(body)
          sendJsonResponse(res, result.status, result.body)
        } catch (error) {
          console.error('Local booking email API error:', error)
          sendJsonResponse(res, 500, { error: 'Unexpected email API error' })
        }
      })

      server.middlewares.use('/api/latest-release', async (req, res) => {
        if (req.method !== 'GET') {
          sendJsonResponse(res, 405, { error: 'Method not allowed' })
          return
        }

        try {
          const payload = await getLatestReleaseMetadata()
          res.setHeader('Cache-Control', 'no-store')
          sendJsonResponse(res, 200, payload)
        } catch (error) {
          const response = getLatestReleaseErrorResponse(error)
          res.setHeader('Cache-Control', 'no-store')
          sendJsonResponse(res, response.status, response.body)
        }
      })

      server.middlewares.use('/download/latest', async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          sendJsonResponse(res, 405, { error: 'Method not allowed' })
          return
        }

        sendRedirectResponse(res, getLatestDownloadUrl())
      })

      server.middlewares.use('/api/downloads/latest', async (req, res) => {
        if (req.method !== 'GET') {
          sendJsonResponse(res, 405, { error: 'Method not allowed' })
          return
        }

        try {
          const payload = await getLatestDownloadsPayload()
          res.setHeader('Cache-Control', getDownloadCacheHeader())
          sendJsonResponse(res, 200, payload)
        } catch (error) {
          const response = getDownloadErrorResponse(error)
          sendJsonResponse(res, response.status, response.body)
        }
      })

      server.middlewares.use('/api/downloads/file', async (req, res) => {
        if (req.method !== 'GET') {
          sendJsonResponse(res, 405, { error: 'Method not allowed' })
          return
        }

        try {
          const requestUrl = new URL(req.url || '/', 'http://localhost')
          const redirect = await getDownloadRedirect(requestUrl.searchParams.get('platform'))
          sendRedirectResponse(res, redirect.location)
        } catch (error) {
          const response = getDownloadErrorResponse(error)
          sendJsonResponse(res, response.status, response.body)
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      demoBookingEmailDevPlugin(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
