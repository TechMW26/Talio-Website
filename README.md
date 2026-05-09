
  # Redesign Talio website 2

  This is a code bundle for Redesign Talio website 2. The original project is available at https://www.figma.com/design/DwALlvUUoetn0uAXyGo8Gj/Redesign-Talio-website-2.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Download releases

  Desktop release metadata is resolved through `/api/downloads/latest`, which reads the configured GitHub release and returns availability entries for Windows, macOS Apple Silicon, macOS Intel, and Linux.

  If GitHub release asset listing is unavailable, the endpoint falls back to `/api/latest-release` and marks platforms that are missing from that fallback as unavailable instead of mapping them to the wrong installer.

  Desktop installer links use `/api/downloads/file?platform=<platform>`, where `<platform>` is one of `windows`, `mac`, `mac-arm64`, `mac-intel`, or `linux`.

  Optional environment variables:

  - `TALIO_RELEASE_REPO` or `GITHUB_RELEASE_REPO`: override the GitHub release repository. Defaults to `https://github.com/avirajsharma-ops/Talio.git`.
  - `TALIO_RELEASE_TAG` or `GITHUB_RELEASE_TAG`: use a specific release tag instead of the latest release.
  - `GITHUB_RELEASE_TOKEN` or `GITHUB_TOKEN`: provide read access for private GitHub release assets.

  