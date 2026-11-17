import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight, Check, Download, Plus, RefreshCw,
} from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple, SiLinux } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useLatestRelease } from '@/app/hooks/useLatestRelease';
import { detectPlatform, releaseDownload } from '@/app/lib/downloads';
import '@/styles/downloads-landing.css';

type PlatformId = 'mac' | 'windows' | 'linux' | 'ios' | 'android';
type DownloadOption = ReturnType<typeof releaseDownload>;

type Platform = {
  id: PlatformId;
  name: string;
  icon: typeof SiApple;
  store?: boolean;
  options: DownloadOption[];
};

const iosStore = 'https://apps.apple.com/in/app/talio-productivity/id6758448703';
const playStore = 'https://play.google.com/store/apps/details?id=sbs.zenova.twa&hl=en_IN';
export function Downloads() {
  usePageMeta(
    'Download Talio',
    'Get Talio for macOS, Windows, Linux, iOS or Android. Find your installer, choose the right Mac chip, and sign in to your workspace.',
  );
  const { release, status, retry } = useLatestRelease();
  const [device, setDevice] = useState<PlatformId | null>(null);
  const macHelp = useRef<HTMLDetailsElement>(null);
  useEffect(() => setDevice(detectPlatform(navigator)), []);

  const platforms: Platform[] = [
    {
      id: 'mac',
      name: 'macOS',
      icon: SiApple,
      options: [
        releaseDownload(release, 'mac-arm64', 'Apple Silicon', 'M-series · arm64'),
        releaseDownload(release, 'mac-intel', 'Intel', 'x64'),
      ],
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: IoLogoMicrosoft,
      options: [releaseDownload(release, 'windows', 'Download for Windows', '64-bit · x64')],
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: SiLinux,
      options: [releaseDownload(release, 'linux', 'Download for Linux', 'Desktop package')],
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: SiApple,
      store: true,
      options: [{ name: 'Open App Store', arch: 'Talio Productivity', url: iosStore, isAvailable: true }],
    },
    {
      id: 'android',
      name: 'Android',
      icon: SiAndroid,
      store: true,
      options: [{ name: 'Open Google Play', arch: 'Talio Productivity', url: playStore, isAvailable: true }],
    },
  ];
  const releaseLabel = release ? `${release.tagName} · Desktop release`
    : status === 'error' ? 'Release unavailable' : 'Checking desktop release…';
  const unavailableLabel = status === 'loading' ? 'Checking availability…'
    : status === 'error' ? 'Release check unavailable' : 'Not in the current release';

  return (
    <main className="download-landing">
      <section id="platforms" className="dl-wrap dl-platforms" aria-labelledby="platform-title">
        <div className="dl-section-heading">
          <h1 id="platform-title">Download Talio</h1>
          <p className="dl-release" role="status"><span data-ready={status === 'ready'} aria-hidden="true" /> {releaseLabel}</p>
        </div>
        {status === 'error' && (
          <div className="dl-release-error" role="alert">
            <p>We couldn’t check the desktop release. You can retry or use the mobile store links below.</p>
            <button type="button" onClick={retry}><RefreshCw aria-hidden="true" /> Retry</button>
          </div>
        )}
        <div className="dl-platform-grid">
          {platforms.map(platform => (
            <article
              key={platform.id}
              id={`download-${platform.id}`}
              className={`dl-platform dl-platform-${platform.id}`}
              aria-labelledby={`dl-name-${platform.id}`}
            >
              <div className="dl-platform-heading">
                <platform.icon className="dl-platform-icon" aria-hidden="true" />
                <h2 id={`dl-name-${platform.id}`}>{platform.name}</h2>
                {device === platform.id && <span className="dl-recommended"><Check aria-hidden="true" /> Your device</span>}
              </div>
              <div className="dl-options">
                {platform.options.map(option => (
                  option.isAvailable ? (
                    <a
                      className="dl-option"
                      href={option.url}
                      key={option.name}
                      target={platform.store ? '_blank' : undefined}
                      rel={platform.store ? 'noopener noreferrer' : undefined}
                    >
                      <span><strong>{option.name}</strong><small>{option.arch}</small></span>
                      {platform.store ? <ArrowUpRight aria-hidden="true" /> : <Download aria-hidden="true" />}
                    </a>
                  ) : (
                    <div className="dl-option dl-option-unavailable" key={option.name}>
                      <span><strong>{option.name}</strong><small>{unavailableLabel}</small></span>
                    </div>
                  )
                ))}
              </div>
              {platform.id === 'mac' && (
                <a
                  className="dl-mac-help"
                  href="#mac-download-help"
                  onClick={() => {
                    if (macHelp.current) macHelp.current.open = true;
                  }}
                >
                  Not sure which chip you have?
                </a>
              )}
            </article>
          ))}
        </div>
        <details id="mac-download-help" ref={macHelp} className="dl-disclosure">
          <summary>Find your Mac chip <Plus aria-hidden="true" /></summary>
          <p>Open the Apple menu and select About This Mac. Choose Apple Silicon if you see an Apple chip, or Intel if you see an Intel processor.</p>
          <a className="dl-text-link" href="#download-mac">See Mac downloads <ArrowUpRight aria-hidden="true" /></a>
        </details>
      </section>
    </main>
  );
}
