
  # Redesign Talio website 2

  This is a code bundle for Redesign Talio website 2. The original project is available at https://www.figma.com/design/DwALlvUUoetn0uAXyGo8Gj/Redesign-Talio-website-2.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Download releases

  Desktop release metadata is resolved through `/api/downloads/latest`. By default, the server reads the latest public release from [`TechMW26/Talio`](https://github.com/TechMW26/Talio/releases) and returns availability entries for Windows, macOS Apple Silicon, macOS Intel, and Linux. If configured, the GitHub token is only used by the server and is never sent to the browser.

  Desktop installer links use `/api/downloads/file?platform=<platform>`, where `<platform>` is one of `windows`, `mac`, `mac-arm64`, `mac-intel`, or `linux`.

  Optional environment variables:

  - `TALIO_RELEASE_REPO`: override the default `TechMW26/Talio` repository using `owner/repository` format or a GitHub URL. If this is already set in Vercel, update it to `TechMW26/Talio`.
  - `GITHUB_RELEASE_REPO`: alias for `TALIO_RELEASE_REPO`.
  - `TALIO_RELEASE_TAG` or `GITHUB_RELEASE_TAG`: use a specific release tag instead of the latest release.
  - `GITHUB_RELEASE_TOKEN`: optional for the public default repository. For a private override, use a fine-grained token with access to that repository and read-only **Contents** permission. A classic token can use the `repo` scope instead.
  - `GITHUB_TOKEN`: alias for `GITHUB_RELEASE_TOKEN`.

  After adding or changing environment variables in Vercel, redeploy the project. Do not commit the token to this repository and do not prefix it with `VITE_`.
