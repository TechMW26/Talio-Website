import type { ScrollChapter } from '@/app/components/ParticleChapters';

export const deviceChapters: readonly ScrollChapter[] = [
  {
    title: 'Check the chip on your Mac.',
    body: 'Open About This Mac before downloading. An Apple chip needs the Apple Silicon build. An Intel processor needs the Intel build.',
    detail: 'Apple menu → About This Mac → Chip or Processor',
    shape: 'laptop',
  },
  {
    title: 'Match the Windows architecture.',
    body: 'The download on this page is the Windows x64 build. Check your system type if you are unsure which architecture your computer uses.',
    detail: 'Settings → System → About → System type',
    shape: 'workspace',
  },
  {
    title: 'Let the Linux package guide the install.',
    body: 'Check the extension on the downloaded file. Use the installation method your distribution supports for that package type.',
    detail: 'Check the filename before opening the package.',
    shape: 'file',
  },
  {
    title: 'Use the store on your phone.',
    body: 'Open the App Store on iOS or Google Play on Android. Check that the listing says Talio Productivity and that your device meets the listed requirements.',
    detail: 'Open the store link for your phone from Choose your platform.',
    shape: 'phone',
  },
  {
    title: 'Start in a browser when you need to.',
    body: 'If you are waiting for a managed install, try the browser version. It opens your workspace with the same work account.',
    detail: 'Open in browser → Sign in with your work account',
    shape: 'globe',
  },
];

export const setupChapters: readonly ScrollChapter[] = [
  {
    title: 'Check what is ready to download.',
    body: 'The desktop version beside the platform list identifies the published release. Talio checks installer availability for each platform separately.',
    detail: 'Desktop release status appears above the platform links.',
    shape: 'download',
  },
  {
    title: 'Find the installer you just saved.',
    body: 'Open your browser’s download history and check that the transfer finished. Then open the saved file from your downloads folder.',
    detail: 'If the download was interrupted, try the platform link again.',
    shape: 'project',
  },
  {
    title: 'Use your organisation’s install route.',
    body: 'On a managed computer, Talio may be distributed by your IT team. If the device blocks the install, give IT the installer name and the message you see.',
    detail: 'Keep your organisation’s device protections in place.',
    shape: 'shield',
  },
  {
    title: 'Pick the work account you were invited with.',
    body: 'When sign-in opens, use the address that received your workspace invitation. A different account may open without the workspace you expect.',
    detail: 'Check the email address before asking an admin to resend an invitation.',
    shape: 'person',
  },
  {
    title: 'Check permissions for the tools you use.',
    body: 'Voice and desktop activity capture depend on device permissions and your organisation’s setup. Follow the guidance for the feature you intend to use.',
    detail: 'Desktop activity capture needs the desktop app.',
    shape: 'headset',
  },
  {
    title: 'Start with work you recognise.',
    body: 'Open a project, team conversation, or task you expect to see. If one is missing, ask the workspace owner to check that your role has access.',
    detail: 'Signing in and having permission for a record are separate steps.',
    shape: 'tasks',
  },
  {
    title: 'Make a setup problem easy to diagnose.',
    body: 'When you contact support, include your device type, operating system, the step that failed, and the exact error message. Keep account credentials out of the report.',
    detail: 'Example: macOS, Apple Silicon, installer opens but sign-in fails.',
    shape: 'chat',
  },
];
