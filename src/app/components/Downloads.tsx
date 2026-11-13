import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Check, Download, Globe, Plus, RefreshCw } from 'lucide-react';
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

const macStore = 'https://apps.apple.com/in/app/talio-productivity/id6758448703';
const playStore = 'https://play.google.com/store/apps/details?id=sbs.zenova.twa&hl=en_IN';

const downloadHelp = [
  {
    question: 'Which Mac download should I choose?',
    answer: 'Open the Apple menu and choose About This Mac. If it lists an Apple M-series chip, choose Apple Silicon. If it lists an Intel processor, choose Intel.',
  },
  {
    question: 'Will I get the latest desktop version?',
    answer: 'Each desktop download checks for the latest published installer when you click. The version shown on this page also refreshes while the page is open.',
  },
  {
    question: 'Can I use Talio without installing it?',
    answer: 'Yes. Open app.talio.in and sign in to your workspace. Features such as desktop activity capture need the desktop app and the permissions set by your company.',
  },
  {
    question: 'What happens after I install?',
    answer: 'Sign in with your work account and follow your company’s setup instructions. For mobile compatibility, check Talio’s listing in the App Store or Google Play.',
  },
];

export function Downloads() {
  usePageMeta(
    'Download Talio',
    'Get Talio for macOS, Windows, Linux, iOS or Android. Choose your device and download the latest available desktop release.',
  );
  const { release, status, retry } = useLatestRelease();
  const reducedMotion = useReducedMotion();
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
      options: [releaseDownload(release, 'linux', 'Download for Linux', 'Desktop installer')],
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
  const releaseLabel = release ? `${release.tagName} · Latest desktop release`
    : status === 'error' ? 'Release unavailable' : 'Checking desktop release…';
  const unavailableLabel = status === 'loading' ? 'Checking availability…'
    : status === 'error' ? 'Release check unavailable' : 'Not in the current release';

  const reveal = {
    initial: reducedMotion ? false as const : { opacity: 0, y: '1.15rem' },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.45, ease: 'easeOut' as const },
  };

  return (
    <main className="download-landing">
      <section className="dl-hero" aria-labelledby="dl-title">
        <div className="dl-wrap dl-hero-layout">
          <div className="dl-hero-copy">
            <span className="dl-kicker dl-enter"><Download aria-hidden="true" /> Talio downloads</span>
            <h1 id="dl-title" className="dl-enter">Your workspace.<br /><em>On your device.</em></h1>
            <p className="dl-enter">
              Get Talio for desktop or mobile. Sign in with your work account to pick up where you left off.
            </p>
            <div className="dl-actions dl-enter">
              <a className="dl-primary" href={recommended ? `#download-${recommended.id}` : '#platforms'}>
                {device === 'mac' ? 'Choose your Mac chip' : recommended ? `Get Talio for ${recommended.name}` : 'Choose your platform'}
                <ArrowDown aria-hidden="true" />
              </a>
              <a className="dl-text-link" href="https://app.talio.in">
                Open in browser <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            {recommended && (
              <p className="dl-device-note dl-enter"><span aria-hidden="true" /> {recommended.name} detected</p>
            )}
          </div>
          <div className="dl-hero-visual" aria-hidden="true">
            <div className="dl-orbit dl-orbit-a" />
            <div className="dl-orbit dl-orbit-b" />
            <div className="dl-art">
              <picture>
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
        </div>
      </section>

      <section id="platforms" className="dl-wrap dl-platforms" aria-labelledby="platform-title">
        <motion.div className="dl-section-heading" {...reveal}>
          <h2 id="platform-title">Choose your platform</h2>
          <p className="dl-release" role="status"><span data-ready={status === 'ready'} aria-hidden="true" /> {releaseLabel}</p>
        </motion.div>
        {status === 'error' && (
          <div className="dl-release-error" role="alert">
            <p>We couldn’t check the desktop release. You can retry or use the mobile store links below.</p>
            <button type="button" onClick={retry}><RefreshCw aria-hidden="true" /> Retry</button>
          </div>
        )}
        <div className="dl-platform-grid">
          {platforms.map((platform, index) => (
            <motion.article
              key={platform.id}
              id={`download-${platform.id}`}
              className={`dl-platform dl-platform-${platform.id}`}
              aria-labelledby={`dl-name-${platform.id}`}
              {...reveal}
              transition={{ ...reveal.transition, delay: (index % 3) * 0.06 }}
            >
              <platform.icon className="dl-platform-mark" aria-hidden="true" />
              <div className="dl-platform-heading">
                <span className="dl-platform-icon"><platform.icon aria-hidden="true" /></span>
                <div>
                  <p>{platform.store ? 'Mobile' : 'Desktop'}</p>
                  <h3 id={`dl-name-${platform.id}`}>{platform.name}</h3>
                </div>
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
            </motion.article>
          ))}
        </div>
        <motion.div className="dl-browser" {...reveal}>
          <Globe aria-hidden="true" />
          <div>
            <h3>Use Talio in your browser</h3>
            <p>Sign in to your workspace without installing the app.</p>
          </div>
          <a className="dl-text-link" href="https://app.talio.in">Open Talio <ArrowUpRight aria-hidden="true" /></a>
        </motion.div>
      </section>

      <section className="dl-wrap dl-help" aria-labelledby="dl-help-title">
        <motion.div className="dl-help-title" {...reveal}>
          <h2 id="dl-help-title">Download help</h2>
          <Link className="dl-text-link" to="/contact">Contact us <ArrowUpRight aria-hidden="true" /></Link>
        </motion.div>
        <motion.div className="dl-help-questions" {...reveal}>
          {downloadHelp.map(({ question, answer }, index) => (
            <details
              id={index === 0 ? 'mac-download-help' : undefined}
              ref={index === 0 ? macHelp : undefined}
              key={question}
            >
              <summary>{question}<Plus aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
