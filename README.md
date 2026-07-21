
  # Redesign Talio website 2

  This is a code bundle for Redesign Talio website 2. The original project is available at https://www.figma.com/design/DwALlvUUoetn0uAXyGo8Gj/Redesign-Talio-website-2.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Download releases

  Desktop release metadata is resolved through `/api/downloads/latest`. The server reads the configured private GitHub release and returns availability entries for Windows, macOS Apple Silicon, macOS Intel, and Linux. The GitHub token is only used by the server and is never sent to the browser.

  Desktop installer links use `/api/downloads/file?platform=<platform>`, where `<platform>` is one of `windows`, `mac`, `mac-arm64`, `mac-intel`, or `linux`.

  Required production environment variables (configure these in Vercel, not in client-side `VITE_*` variables):

  - `GITHUB_RELEASE_TOKEN`: a fine-grained GitHub token with access to the release repository and read-only **Contents** permission. A classic token can use the `repo` scope instead.
  - `TALIO_RELEASE_REPO`: the repository in `owner/repository` format or as a GitHub URL.

  Optional environment variables:

  - `GITHUB_RELEASE_REPO`: alias for `TALIO_RELEASE_REPO`.
  - `TALIO_RELEASE_TAG` or `GITHUB_RELEASE_TAG`: use a specific release tag instead of the latest release.
  - `GITHUB_TOKEN`: alias for `GITHUB_RELEASE_TOKEN`.

  After adding or changing environment variables in Vercel, redeploy the project. Do not commit the token to this repository and do not prefix it with `VITE_`.
