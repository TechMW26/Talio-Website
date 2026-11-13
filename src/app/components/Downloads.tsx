import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowDown, ArrowUpRight, Check, Download, Plus, RefreshCw,
} from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple, SiLinux } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useLatestRelease } from '@/app/hooks/useLatestRelease';
import { detectPlatform, releaseDownload } from '@/app/lib/downloads';
import { downloadFaq } from '@/app/content/downloadFaq';
import { deviceChapters, setupChapters } from '@/app/content/downloadScrollChapters';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters, type ScrollChapter } from './ParticleChapters';
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
const browserApp = 'https://app.talio.in';
const downloadChapters: readonly ScrollChapter[] = [
  ...deviceChapters.map((chapter, index) => ({
    ...chapter,
    id: `choose-your-build-${index + 1}`,
    aliases: index === 0 ? ['match-your-device'] : undefined,
  })),
  ...setupChapters.map((chapter, index) => ({
    ...chapter,
    id: `from-download-to-workspace-${index + 1}`,
    aliases: index === 0 ? ['from-download-to-workspace']
      : index === 1 ? ['install-talio']
      : index === 3 ? ['sign-in'] : undefined,
  })),
];

function DeviceIllustration() {
  return (
    <div className="dl-hero-art" aria-hidden="true">
      <div className="dl-laptop">
        <div className="dl-laptop-screen">
          <div className="dl-screen-title">
            <span>Talio</span><span>Workspace</span>
          </div>
          <div className="dl-screen-layout">
            <div className="dl-screen-menu"><span /><span /><span /><span /></div>
            <div className="dl-screen-main">
              <span className="dl-screen-heading">Launch plan</span>
              <span className="dl-screen-row"><Check /><span>Share the brief</span></span>
              <span className="dl-screen-row"><span className="dl-screen-checkbox" /><span>Review the draft</span></span>
              <span className="dl-screen-row"><span className="dl-screen-checkbox" /><span>Confirm the date</span></span>
            </div>
          </div>
        </div>
        <div className="dl-laptop-base"><span /></div>
      </div>
      <div className="dl-phone">
        <div className="dl-phone-speaker" />
        <div className="dl-phone-screen">
          <span>Talio</span>
          <strong>Launch plan</strong>
          <span className="dl-phone-rule"><Check /><i /></span>
          <span className="dl-phone-rule"><i /></span>
          <span className="dl-phone-rule"><i /></span>
        </div>
      </div>
    </div>
  );
}

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
  const recommended = platforms.find(platform => platform.id === device);
  const releaseLabel = release ? `${release.tagName} · Desktop release`
    : status === 'error' ? 'Release unavailable' : 'Checking desktop release…';
  const unavailableLabel = status === 'loading' ? 'Checking availability…'
    : status === 'error' ? 'Release check unavailable' : 'Not in the current release';

  return (
    <main className="download-landing">
      <section className="dl-hero" aria-labelledby="dl-title">
        <div className="dl-wrap dl-hero-layout">
          <div className="dl-hero-copy">
            <span className="dl-kicker">Talio downloads</span>
            <h1 id="dl-title">Take Talio<br />with you.</h1>
            <p>Your projects, conversations and people tools on desktop, mobile, or the web.</p>
            <div className="dl-actions">
              <a className="dl-primary" href={recommended ? `#download-${recommended.id}` : '#platforms'}>
                {device === 'mac' ? 'Choose your Mac chip' : recommended ? `Get Talio for ${recommended.name}` : 'Choose your platform'}
                <ArrowDown aria-hidden="true" />
              </a>
              <a className="dl-text-link" href={browserApp}>
                Open in browser <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <DeviceIllustration />
        </div>
      </section>

      <ParticleChapters
        id="choose-your-build"
        heading="From download to first task"
        chapters={downloadChapters}
        flight="sweep"
      />

      <section id="platforms" className="dl-wrap dl-platforms" aria-labelledby="platform-title">
        <div className="dl-section-heading">
          <h2 id="platform-title">Choose your platform.</h2>
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
                <h3 id={`dl-name-${platform.id}`}>{platform.name}</h3>
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

      <div className="dl-wrap dl-faq"><LandingFaq items={downloadFaq} title="Download and setup FAQs" /></div>

      <section className="dl-wrap dl-support" aria-labelledby="dl-support-heading">
        <div>
          <h2 id="dl-support-heading">Need a hand getting set up?</h2>
          <p>Contact us if you can’t find the right installer or open your workspace.</p>
        </div>
        <Link className="dl-text-link" to="/contact">Contact support <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
