import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
  ArrowDown, ArrowUpRight, Check, Download, Globe, Laptop, PackageCheck,
  Plus, RefreshCw, Smartphone, UserRound,
} from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple, SiLinux } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useLatestRelease } from '@/app/hooks/useLatestRelease';
import { detectPlatform, releaseDownload } from '@/app/lib/downloads';
import { StoryPath, type StoryChapter } from './StoryPath';
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

const macStore = 'https://apps.apple.com/in/app/talio-productivity/id6758448703';
const playStore = 'https://play.google.com/store/apps/details?id=sbs.zenova.twa&hl=en_IN';
const browserApp = 'https://app.talio.in';
const heroTrace = 'M-100 410 C65 405 97 82 318 136 S548 393 699 211 S900 40 1040 79';

export function Downloads() {
  usePageMeta(
    'Download Talio',
    'Get Talio for macOS, Windows, Linux, iOS or Android. Find your installer, choose the right Mac chip, and sign in to your workspace.',
  );
  const { release, status, retry } = useLatestRelease();
  const reducedMotion = useReducedMotion();
  const [device, setDevice] = useState<PlatformId | null>(null);
  const macHelp = useRef<HTMLDetailsElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start 80%', 'end 20%'] });
  const traceLength = useTransform(scrollYProgress, [0, 1], [0.16, 1]);

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
      options: [{ name: 'Open App Store', arch: 'Talio Productivity', url: macStore, isAvailable: true }],
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

  const chapters: StoryChapter[] = [
    {
      id: 'match-your-device',
      label: 'Choose the right build',
      title: 'Which Talio should I get?',
      description: 'If you use Talio from a managed work computer, check whether your IT team provides the installer. For a Mac you manage yourself, the chip tells you which build to choose.',
      visual: (
        <dl className="dl-story-list">
          <div><dt><Laptop aria-hidden="true" /> On your computer</dt><dd>macOS, Windows or Linux</dd></div>
          <div><dt><Smartphone aria-hidden="true" /> On your phone</dt><dd>iOS App Store or Google Play</dd></div>
          <div><dt><Globe aria-hidden="true" /> In a browser</dt><dd>Open your workspace without installing</dd></div>
        </dl>
      ),
      children: (
        <details id="mac-download-help" ref={macHelp} className="dl-disclosure">
          <summary>Find your Mac chip <Plus aria-hidden="true" /></summary>
          <p>Open the Apple menu and choose About This Mac. If it lists an Apple M-series chip, choose Apple Silicon. If it lists an Intel processor, choose Intel.</p>
          <a className="dl-text-link" href="#download-mac">See Mac downloads <ArrowUpRight aria-hidden="true" /></a>
        </details>
      ),
    },
    {
      id: 'install-talio',
      label: 'Install Talio',
      title: 'Install the app for your device.',
      description: 'On a computer, open the downloaded package and follow the setup prompts for your platform. On iOS or Android, check compatibility on the store listing and install Talio Productivity there.',
      visual: (
        <div className="dl-story-release">
          <PackageCheck aria-hidden="true" />
          <strong>{release?.tagName ?? 'Desktop installer'}</strong>
          <span>{release ? 'Current desktop release' : 'Version shown when available'}</span>
        </div>
      ),
      children: (
        <p className="dl-story-note">
          The desktop links resolve to the latest published installer each time you click.
        </p>
      ),
    },
    {
      id: 'sign-in',
      label: 'Open your workspace',
      title: 'Pick up where you left off.',
      description: 'Open Talio and sign in with your work account. Your workspace and role determine which projects, tasks and people tools you can access.',
      visual: (
        <dl className="dl-story-list">
          <div><dt><UserRound aria-hidden="true" /> Work account</dt><dd>Use the account from your organisation</dd></div>
          <div><dt><Check aria-hidden="true" /> Workspace access</dt><dd>Open the work your role can see</dd></div>
        </dl>
      ),
      children: (
        <>
          <p className="dl-story-note">
            Desktop activity capture requires the desktop app and your organisation’s setup. Follow the permission prompts for the features you use.
          </p>
          <a className="dl-text-link" href={browserApp}>Open Talio in a browser <ArrowUpRight aria-hidden="true" /></a>
        </>
      ),
    },
  ];

  return (
    <main className="download-landing">
      <section ref={heroRef} className="dl-hero" aria-labelledby="dl-title">
        <div className="dl-wrap dl-hero-layout">
          <div className="dl-hero-copy">
            <span className="dl-kicker"><Download aria-hidden="true" /> Talio downloads</span>
            <h1 id="dl-title">Take your work <em>with you.</em></h1>
            <p>Open the same Talio workspace on your computer, phone or browser. Start with the download for your device.</p>
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
          <div className="dl-hero-visual" aria-hidden="true">
            <svg className="dl-hero-trace" viewBox="0 0 900 460" fill="none" focusable="false">
              <path d={heroTrace} className="dl-trace-base" />
              <motion.path d={heroTrace} className="dl-trace-light" style={{ pathLength: reducedMotion ? 1 : traceLength }} />
            </svg>
            <picture className="dl-art">
              <source media="(max-width: 40rem)" srcSet="/landing/devices-small.webp" />
              <img
                src="/landing/devices.webp"
                alt=""
                width={1120}
                height={631}
                {...{ fetchpriority: 'high' }}
                decoding="async"
              />
            </picture>
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
          <h2 id="dl-setup-heading">From installer to workspace.</h2>
        </div>
        <StoryPath ariaLabel="Download and setup chapters" chapters={chapters} />
      </section>

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
