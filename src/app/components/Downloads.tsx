import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowUpRight, Check, Download, Globe, RefreshCw, Monitor, Plus } from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple, SiLinux } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useLatestRelease } from '@/app/hooks/useLatestRelease';
import { detectPlatform, releaseDownload } from '@/app/lib/downloads';
import '@/styles/product.css';

export function Downloads() {
  usePageMeta('Download Talio', 'Get Talio for macOS, Windows, Linux, iOS or Android. Choose your device and download the latest available desktop release.');
  const { release, status, retry } = useLatestRelease();
  const [device, setDevice] = useState<string | null>(null);
  useEffect(() => setDevice(detectPlatform(navigator)), []);
  const version = release?.tagName || (status === 'loading' ? 'Checking release…' : 'Release unavailable');
  const platforms = [
    { id: 'mac', name: 'macOS', icon: SiApple, subtitle: 'For your Mac', kind: 'Desktop', options: [releaseDownload(release, 'mac-arm64', 'Apple Silicon', 'M-series · arm64'), releaseDownload(release, 'mac-intel', 'Intel', 'x64')] },
    { id: 'windows', name: 'Windows', icon: IoLogoMicrosoft, subtitle: 'For your PC', kind: 'Desktop', options: [releaseDownload(release, 'windows', 'Download for Windows', '64-bit · x64')] },
    { id: 'linux', name: 'Linux', icon: SiLinux, subtitle: 'For your Linux desktop', kind: 'Desktop', options: [releaseDownload(release, 'linux', 'Download for Linux', 'Desktop installer')] },
    { id: 'ios', name: 'iOS', icon: SiApple, subtitle: 'Take Talio with you', kind: 'Mobile', options: [{ name: 'Open App Store', arch: 'Talio Productivity', url: 'https://apps.apple.com/in/app/talio-productivity/id6758448703', isAvailable: true }] },
    { id: 'android', name: 'Android', icon: SiAndroid, subtitle: 'Stay connected on the go', kind: 'Mobile', options: [{ name: 'Open Google Play', arch: 'Talio Productivity', url: 'https://play.google.com/store/apps/details?id=sbs.zenova.twa&hl=en_IN', isAvailable: true }] },
  ];
  const recommended = platforms.find(platform => platform.id === device);
  return <main className="product-page downloads-page">
    <section className="product-wrap download-hero">
      <span className="product-eyebrow"><Download size={15} /> TAKE YOUR WORKSPACE WITH YOU</span>
      <h1>Your day. Your device.<br /><em>Your Talio.</em></h1>
      <p className="product-lead">Pick up a conversation, check your work or get help from MIRA.<br className="product-desktop-break" /> Start with the app that fits your day.</p>
      <div className="download-device-strip" aria-hidden="true"><span><Monitor size={30} /></span><i /><span className="download-device-logo">t.</span><i /><span><SiAndroid size={27} /></span></div>
      <div className="download-recommendation"><span className="product-live-dot" /><span>{recommended ? `${recommended.name} detected` : 'Choose your device below'}</span><a href={`#download-${recommended?.id || 'mac'}`}>{device === 'mac' ? 'Choose your Mac chip' : recommended ? 'Find your download' : 'See the apps'}<ArrowDown size={14} /></a></div>
    </section>
    <section className="product-wrap download-platforms" aria-labelledby="platform-title">
      <div className="product-section-heading product-heading-inline"><div><span className="product-eyebrow">ONE WORKSPACE. FIVE PLATFORMS.</span><h2 id="platform-title">Make yourself at home.</h2></div><div className="download-release" role="status"><span className={status === 'ready' ? 'product-live-dot' : 'product-neutral-dot'} />{version}{status === 'ready' && <span>Latest desktop release</span>}</div></div>
      {status === 'error' && <div className="download-error" role="alert"><span>We couldn’t check the desktop release. Please try again. The mobile store links are still available.</span><button onClick={retry}><RefreshCw size={16} /> Retry</button></div>}
      <div className="download-grid">{platforms.map(platform => <article id={`download-${platform.id}`} className={`download-card ${device === platform.id ? 'download-recommended' : ''}`} key={platform.id}>
        <div className="download-card-label"><span>{platform.kind}</span>{device === platform.id && <span><Check size={12} /> Your device</span>}</div>
        <div className="download-card-heading"><span className={`download-platform-icon platform-${platform.id}`}><platform.icon size={29} /></span><div><h3>{platform.name}</h3><p>{platform.subtitle}</p></div></div>
        <div className="download-options">{platform.options.map(option => option.isAvailable ? <a href={option.url} key={option.name} target={platform.kind === 'Mobile' ? '_blank' : undefined} rel={platform.kind === 'Mobile' ? 'noopener noreferrer' : undefined}><span><strong>{option.name}</strong><small>{option.arch}</small></span>{platform.kind === 'Mobile' ? <ArrowUpRight size={19} /> : <Download size={18} />}</a> : <div className="download-disabled" key={option.name}><strong>{option.name}</strong><small>{status === 'loading' ? 'Checking availability…' : status === 'error' ? 'Release check unavailable' : 'Not in the current release'}</small></div>)}</div>
        <div className="download-card-foot">{platform.id === 'mac' ? 'Choose the chip in your Mac.' : platform.kind === 'Mobile' ? 'Compatibility details are listed in the store.' : 'Version and availability checked automatically.'}</div>
      </article>)}</div>
      <div className="download-browser"><span className="product-icon"><Globe size={24} /></span><div><h3>Rather stay in your browser?</h3><p>Open your workspace on the web. No installation needed.</p></div><a className="product-text-link" href="https://app.talio.in">Open Talio <ArrowUpRight size={17} /></a></div>
    </section>
    <section className="product-wrap product-section product-faq"><div><span className="product-eyebrow">A LITTLE HELP GETTING STARTED</span><h2>One download.<br />A few useful details.</h2><Link className="product-text-link" to="/contact">Need a hand? <ArrowRightIcon /></Link></div><div>
      <details><summary>Which Mac download should I choose?<Plus size={18} /></summary><p>Open the Apple menu and choose About This Mac. If you see an Apple M-series chip, choose Apple Silicon. If it lists an Intel processor, choose Intel. Your browser cannot reliably tell them apart.</p></details>
      <details><summary>Will I get the latest desktop version?<Plus size={18} /></summary><p>This page checks the published release when you arrive and refreshes while it is open. Each desktop download checks the available installer again when you click.</p></details>
      <details><summary>Are the desktop, web and mobile apps identical?<Plus size={18} /></summary><p>They connect to your Talio workspace, but device capabilities differ. Desktop activity capture needs the desktop app and permissions. Voice, notifications and other features also depend on your device and company setup.</p></details>
      <details><summary>What happens after I install?<Plus size={18} /></summary><p>Sign in with your work account. Follow your company’s setup instructions and allow the permissions needed for the features you use. On mobile, check the store listing for supported operating systems.</p></details>
    </div></section>
  </main>;
}
function ArrowRightIcon() { return <ArrowUpRight size={17} />; }
