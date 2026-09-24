import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Download, Star, CheckCircle2 } from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple, SiLinux } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useCompensatedMinWidth } from '@/app/hooks/useZoomCompensatedViewport';

import { useLatestRelease } from '@/app/hooks/useLatestRelease';
import { detectPlatform, releaseDownload } from '@/app/lib/downloads';

export function Downloads() {
  usePageMeta('Downloads', 'Download Talio for macOS, Windows, Linux, iOS, and Android. Get productivity visibility, coordination, and connected HR workflows on every device.');
  const { release, status, retry } = useLatestRelease();
  const version = release?.tagName ?? (status === 'loading' ? 'Checking version…' : 'Version unavailable');
  const hasDesktopRequirementsGrid = useCompensatedMinWidth(1120);
  const hasTabletRequirementsGrid = useCompensatedMinWidth(768);

  const heroRef = useRef(null);
  const platformsRef = useRef<HTMLElement | null>(null);
  const requirementsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });
  const platformsInView = useInView(platformsRef, { once: true, margin: '-10%' });
  const requirementsInView = useInView(requirementsRef, { once: true, margin: '-10%' });

  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);

  useEffect(() => { setDetectedPlatform(detectPlatform(window.navigator)); }, []);

  const platforms = [
    {
      id: 'mac',
      name: 'macOS',
      icon: SiApple,
      version,
      recommendedLabel: 'Download for macOS',
      recommendedMeta: version,
      recommendedUrl: 'https://app.talio.in/download/mac',
      isAvailable: true,
      downloads: [
        releaseDownload(release, 'mac-arm64', 'Apple Silicon (M-series)', 'arm64'),
        releaseDownload(release, 'mac-intel', 'Intel (x64)', 'x64')
      ],
      gradient: 'from-gray-500 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100'
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: IoLogoMicrosoft,
      version,
      recommendedLabel: 'Download for Windows',
      recommendedMeta: version,
      recommendedUrl: 'https://app.talio.in/download/windows',
      isAvailable: true,
      downloads: [
        releaseDownload(release, 'windows', 'Windows 10/11 (64-bit)', 'x64')
      ],
      gradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      id: 'linux',
      name: 'Linux', icon: SiLinux, version,
      recommendedLabel: 'Download for Linux', recommendedMeta: version,
      recommendedUrl: 'https://app.talio.in/download/linux', isAvailable: true,
      downloads: [releaseDownload(release, 'linux', 'Linux desktop installer', '')],
      gradient: 'from-orange-500 to-red-600',
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: SiApple,
      version: 'App Store',
      recommendedLabel: 'Download for iOS',
      recommendedMeta: 'App Store • Live now',
      recommendedUrl: 'https://apps.apple.com/in/app/talio-productivity/id6758448703',
      isAvailable: true,
      downloads: [
        { name: 'Talio Productivity', isAvailable: true, arch: 'App Store', url: 'https://apps.apple.com/in/app/talio-productivity/id6758448703' }
      ],
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      id: 'android',
      name: 'Android',
      icon: SiAndroid,
      version: 'Google Play',
      recommendedLabel: 'Download for Android',
      recommendedMeta: 'Google Play • Live now',
      recommendedUrl: 'https://play.google.com/store/apps/details?id=sbs.zenova.twa&hl=en_IN',
      isAvailable: true,
      downloads: [
        { name: 'Talio Productivity', isAvailable: true, arch: 'Google Play', url: 'https://play.google.com/store/apps/details?id=sbs.zenova.twa&hl=en_IN' }
      ],
      gradient: 'from-emerald-500 to-green-700',
      bgGradient: 'from-emerald-50 to-green-100'
    }
  ];

  // macOS browsers cannot reliably distinguish Intel from Apple Silicon.
  const recommendedPlatform = platforms.find((platform) => platform.id === detectedPlatform);
  const recommendation = recommendedPlatform?.downloads.find(download => download.isAvailable);
  const releaseMessage = status === 'loading' ? 'Checking latest release…' : status === 'error' ? 'Unable to check the latest release.' : 'Not published in the latest release.';

  const requirements = {
    macOS: {
      items: [
        'macOS 10.15 (Catalina) or later',
        'Apple Silicon or Intel processor',
        '200 MB available disk space'
      ]
    },
    Windows: {
      items: [
        'Windows 10 or Windows 11',
        '64-bit processor',
        '200 MB available disk space'
      ]
    },
    iOS: {
      items: [
        'iPhone running iOS 16 or later',
        'App Store access for installation',
        'Internet connection for sync and updates'
      ]
    }
  };

  return (
    <div className="bg-black min-h-screen relative transition-colors duration-300">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-[90vh] flex items-center justify-center py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950/30"
        style={{ position: 'relative' }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-purple-400 uppercase tracking-widest">
              <Download className="w-4 h-4 shrink-0" />
              ✦ DOWNLOADS
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 text-center"
          >
            Download Talio
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light text-center"
          >
            Get the native experience for attendance, productivity visibility, real-time coordination, and connected HR workflows.
          </motion.p>

          {/* Recommended Download */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700/50 relative overflow-hidden">
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Recommended for your device
                  </span>
                </div>

                {recommendation && detectedPlatform !== 'mac' ? (
                  <a href={recommendation.url} className="flex items-center justify-between gap-4 rounded-2xl bg-purple-600 px-6 py-5 text-white">
                    <span><strong className="block">{recommendedPlatform?.recommendedLabel}</strong><span className="text-sm">{recommendedPlatform?.recommendedMeta}</span></span>
                    <Download className="h-6 w-6 shrink-0" />
                  </a>
                ) : detectedPlatform === 'mac' && recommendation ? (
                  <div className="space-y-3">
                    {recommendedPlatform?.downloads.filter(download => download.isAvailable).map(download => (
                      <a key={download.url} href={download.url} className="flex items-center justify-between gap-4 rounded-2xl bg-purple-600 px-6 py-4 text-white">
                        <span className="text-left"><strong className="block">{download.name}</strong><span className="text-sm">{version} • {download.arch}</span></span>
                        <Download className="h-5 w-5 shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <a onClick={event => { event.preventDefault(); platformsRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' }); }} href="#platforms" className="block rounded-2xl bg-purple-600 px-6 py-5 font-semibold text-white">
                    {detectedPlatform === 'mac' ? 'Choose your Mac: Apple Silicon or Intel' : 'Choose your platform below'}
                  </a>
                )}
                {status !== 'ready' && (
                  <p role="status" className="mt-4 text-sm text-gray-300">
                    {releaseMessage} {status === 'error' && <button onClick={retry} className="underline">Retry</button>}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Platforms Section */}
      <section 
        id="platforms"
        ref={platformsRef} 
        className="py-20 md:py-32 relative overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={platformsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 tracking-tighter text-center text-white leading-[1.05]"
          >
            All Platforms
          </motion.h2>

          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
            {platforms.map((platform, index) => {
              const Icon = platform.icon;

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={platformsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative min-w-0"
                >
                  <div className="bg-gray-900/60 rounded-3xl p-6 border border-gray-800/60 hover:border-gray-700/80 hover:bg-gray-900/80 transition-all duration-500 h-full flex flex-col">
                    {/* Platform Icon & Name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 shrink-0 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                        <p className="text-sm text-gray-400">{platform.version}</p>
                      </div>
                    </div>

                    {/* Download Options */}
                    <div className="space-y-3 flex-grow">
                      {platform.downloads.map((download, idx) => download.isAvailable ? (
                        <a key={idx} href={download.url}
                          target={platform.id === 'ios' || platform.id === 'android' ? '_blank' : undefined}
                          rel={platform.id === 'ios' || platform.id === 'android' ? 'noopener noreferrer' : undefined}
                          className="w-full px-4 py-4 rounded-xl flex items-center justify-between gap-4 bg-gray-800/50 hover:bg-gray-800 text-white border border-gray-700/50">
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-gray-200">{download.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{download.arch}</div>
                          </div>
                          <Download className="w-5 h-5 shrink-0" />
                        </a>
                      ) : (
                        <div key={idx} className="rounded-xl border border-gray-800 px-4 py-4 text-sm text-gray-400">
                          <div className="font-semibold text-gray-300">{download.name}</div>
                          <p className="mt-1">{releaseMessage}</p>
                        </div>
                      ))}
                    </div>

                    {platform.id === 'ios' && (
                      <div className="mt-4 flex items-center gap-2 text-purple-600">
                        <SiApple className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-semibold">Available on App Store</span>
                      </div>
                    )}

                    {platform.id === 'android' && (
                      <div className="mt-4 flex items-center gap-2 text-emerald-400">
                        <SiAndroid className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-semibold">Available on Google Play</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Requirements Section */}
      <section 
        ref={requirementsRef} 
        className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900 relative overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 tracking-tighter text-center text-white leading-[1.05]"
          >
            System Requirements
          </motion.h2>

          <div className={`grid gap-6 ${hasDesktopRequirementsGrid ? 'grid-cols-3' : hasTabletRequirementsGrid ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {Object.entries(requirements).map(([platform, data], index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 30 }}
                animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/60 rounded-3xl p-8 border border-gray-800/60"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{platform}</h3>
                <ul className="space-y-4">
                  {data.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-lg">
              Need help? Check our{' '}
              <a href="/documents" className="text-purple-400 hover:text-purple-300 font-semibold underline">
                developer documentation
              </a>{' '}
              or{' '}
              <a href="/contact" className="text-purple-400 hover:text-purple-300 font-semibold underline">
                contact support
              </a>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}