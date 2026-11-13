import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import {
  ArrowDown, ArrowUpRight, Check, Download, Laptop, PackageCheck, Plus, RefreshCw, UserRound,
} from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple, SiLinux } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useLatestRelease } from '@/app/hooks/useLatestRelease';
import { detectPlatform, releaseDownload } from '@/app/lib/downloads';
import { downloadFaq } from '@/app/content/downloadFaq';
import { deviceChapters, setupChapters } from '@/app/content/downloadScrollChapters';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters } from './ParticleChapters';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
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
const downloadShapes = ['laptop', 'phone', 'globe'] as const satisfies readonly ParticleShape[];
const deviceViews = ['Desktop', 'Mobile', 'Browser'] as const;

export function Downloads() {
  usePageMeta(
    'Download Talio',
    'Get Talio for macOS, Windows, Linux, iOS or Android. Find your installer, choose the right Mac chip, and sign in to your workspace.',
  );
  const { release, status, retry } = useLatestRelease();
  const [device, setDevice] = useState<PlatformId | null>(null);
  const macHelp = useRef<HTMLDetailsElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const lastScrollView = useRef(0);
  const [deviceView, setDeviceView] = useState(0);
  const deviceMorph = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start 12%', 'end 55%'] });

  function showDeviceView(index: number) {
    setDeviceView(index);
    deviceMorph.set(index / (deviceViews.length - 1));
  }

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const index = Math.round(value * (deviceViews.length - 1));
    if (index === lastScrollView.current) return;
    lastScrollView.current = index;
    showDeviceView(index);
  });

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
      <section ref={heroRef} className="dl-hero" aria-labelledby="dl-title">
        <div className="dl-wrap dl-hero-layout">
          <div className="dl-hero-copy">
            <span className="dl-kicker"><Download aria-hidden="true" /> Talio downloads</span>
            <h1 id="dl-title">Your work.<em>Your device.</em></h1>
            <p>Install Talio on your computer or phone, or open it in your browser. Sign in with the same work account.</p>
            <div className="dl-actions">
              <a className="dl-primary" href={recommended ? `#download-${recommended.id}` : '#platforms'}>
                {device === 'mac' ? 'Choose your Mac chip' : recommended ? `Get Talio for ${recommended.name}` : 'Choose your platform'}
                <ArrowDown aria-hidden="true" />
              </a>
              <a className="dl-text-link" href={browserApp}>
                Open in browser <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            {recommended && (
              <p className="dl-device-note"><span aria-hidden="true" /> {recommended.name} detected</p>
            )}
          </div>
          <div className="dl-hero-visual">
            <ParticleIllustration
              className="dl-device-particles"
              shapes={downloadShapes}
              progress={deviceMorph}
              label="A particle laptop becomes a phone, then a globe for browser access"
            />
            <div className="dl-visual-switch" role="group" aria-label="Preview Talio on another device">
              {deviceViews.map((view, index) => (
                <button
                  key={view}
                  type="button"
                  aria-pressed={deviceView === index}
                  onClick={() => showDeviceView(index)}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

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
      </section>

      <section className="dl-wrap dl-setup" aria-labelledby="dl-setup-heading">
        <div className="dl-section-heading">
          <h2 id="dl-setup-heading">Get set up in three steps.</h2>
          <p>Already installed? <a className="dl-text-link" href={browserApp}>Open your workspace <ArrowUpRight aria-hidden="true" /></a></p>
        </div>
        <ol className="dl-setup-steps">
          <li id="match-your-device">
            <Laptop aria-hidden="true" />
            <h3>Match the installer.</h3>
            <p>Choose the build for your device. If your organisation manages your computer, use the installer your IT team provides.</p>
            <details id="mac-download-help" ref={macHelp} className="dl-disclosure">
              <summary>Find your Mac chip <Plus aria-hidden="true" /></summary>
              <p>Open the Apple menu and select About This Mac. Choose Apple Silicon if you see an Apple chip, or Intel if you see an Intel processor.</p>
              <a className="dl-text-link" href="#download-mac">See Mac downloads <ArrowUpRight aria-hidden="true" /></a>
            </details>
          </li>
          <li id="install-talio">
            <PackageCheck aria-hidden="true" />
            <h3>Open the package.</h3>
            <p>Follow the desktop setup prompts, or install Talio Productivity from your mobile store. Check the store listing for device compatibility.</p>
          </li>
          <li id="sign-in">
            <UserRound aria-hidden="true" />
            <h3>Use your work account.</h3>
            <p>Open Talio and sign in. You’ll see the workspace and tools your organisation gives you access to.</p>
          </li>
        </ol>
        <nav className="dl-guide-nav" aria-label="Installation guide">
          <a className="dl-text-link" href="#choose-your-build">Compare device builds <ArrowDown aria-hidden="true" /></a>
          <a className="dl-text-link" href="#from-download-to-workspace">Walk through setup <ArrowDown aria-hidden="true" /></a>
        </nav>
      </section>

      <ParticleChapters
        className="dl-wrap dl-device-tour particle-chapters-reverse"
        id="choose-your-build"
        heading="Find the build that fits."
        chapters={deviceChapters}
      />

      <ParticleChapters
        className="dl-wrap dl-first-day"
        id="from-download-to-workspace"
        heading="From the download to your first task."
        chapters={setupChapters}
      />

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
