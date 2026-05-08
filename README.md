
  # Redesign Talio website 2

  This is a code bundle for Redesign Talio website 2. The original project is available at https://www.figma.com/design/DwALlvUUoetn0uAXyGo8Gj/Redesign-Talio-website-2.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Download releases

  Desktop release metadata is resolved through `/api/latest-release`, which rewrites to the public Talio app endpoint at `https://app.talio.in/api/latest-release` in production and is handled by Vite middleware in local development.

  The desktop installer link uses the `download_url` returned by that response, currently `https://app.talio.in/download/latest`.

  Optional environment variables:

  - `TALIO_LATEST_RELEASE_API_URL`: override the latest release metadata endpoint. Defaults to `https://app.talio.in/api/latest-release`.
  - `TALIO_LATEST_DOWNLOAD_URL`: override the local dev redirect target for `/download/latest`. Defaults to `https://app.talio.in/download/latest`.

  