import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Download, Star, CheckCircle2 } from 'lucide-react';
import { IoLogoMicrosoft } from 'react-icons/io5';
import { SiAndroid, SiApple } from 'react-icons/si';
import { usePageMeta } from '@/app/hooks/usePageMeta';

export function Downloads() {
  usePageMeta('Downloads', 'Download Talio for macOS, Windows, and iOS. Android support is coming soon. Get productivity visibility, coordination, and connected HR workflows on every device.');

  const heroRef = useRef(null);
  const platformsRef = useRef(null);
  const requirementsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const platformsInView = useInView(platformsRef, { once: true, margin: "-100px" });
  const requirementsInView = useInView(requirementsRef, { once: true, margin: "-100px" });

  const [detectedPlatform, setDetectedPlatform] = useState<'windows' | 'mac' | 'ios' | 'android'>('windows');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      setDetectedPlatform('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setDetectedPlatform('ios');
    } else if (userAgent.includes('mac')) {
      setDetectedPlatform('mac');
    } else if (userAgent.includes('win')) {
      setDetectedPlatform('windows');
    }
  }, []);

  const platforms = [
    {
      id: 'mac',
      name: 'macOS',
      icon: SiApple,
      version: 'v3.2.0',
      recommendedLabel: 'Download for macOS',
      recommendedMeta: 'Apple Silicon • v3.2.0',
      recommendedUrl: 'https://app.talio.in/download/mac',
      isAvailable: true,
      downloads: [
        { name: 'Apple Silicon (M-series)', arch: 'arm64', url: 'https://app.talio.in/download/mac-arm64' },
        { name: 'Intel (x64)', arch: 'x64', url: 'https://app.talio.in/download/mac-intel' }
      ],
      gradient: 'from-gray-500 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100'
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: IoLogoMicrosoft,
      version: 'v3.2.0',
      recommendedLabel: 'Download for Windows',
      recommendedMeta: 'Windows 10/11 • v3.2.0',
      recommendedUrl: 'https://app.talio.in/download/windows',
      isAvailable: true,
      downloads: [
        { name: 'Windows 10/11 (64-bit)', arch: 'x64', url: 'https://app.talio.in/download/windows' }
      ],
      gradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100'
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
        { name: 'Talio Productivity', arch: 'App Store', url: 'https://apps.apple.com/in/app/talio-productivity/id6758448703' }
      ],
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      id: 'android',
      name: 'Android',
      icon: SiAndroid,
      version: 'Coming Soon',
      recommendedLabel: 'Android app coming soon',
      recommendedMeta: 'Google Play release in progress',
      recommendedUrl: undefined,
      isAvailable: false,
      downloads: [],
      gradient: 'from-emerald-500 to-green-700',
      bgGradient: 'from-emerald-50 to-green-100'
    }
  ];

  const recommendedPlatform = platforms.find((platform) => platform.id === detectedPlatform) ?? platforms[1];

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
    <div className="bg-gray-950 min-h-screen relative transition-colors duration-300">
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
              <Download className="w-4 h-4" />
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

                {recommendedPlatform.isAvailable ? (
                  <motion.a
                    href={recommendedPlatform.recommendedUrl}
                    target={recommendedPlatform.id === 'ios' ? '_blank' : undefined}
                    rel={recommendedPlatform.id === 'ios' ? 'noopener noreferrer' : undefined}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-xl shadow-purple-500/30 transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <recommendedPlatform.icon className="w-6 h-6 shrink-0" />
                      <div className="text-left">
                        <div className="font-bold">{recommendedPlatform.recommendedLabel}</div>
                        <div className="text-sm text-white/80 font-normal">{recommendedPlatform.recommendedMeta}</div>
                      </div>
                    </div>
                    <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                  </motion.a>
                ) : (
                  <div className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-xl shadow-emerald-500/20 transition-all duration-300 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <recommendedPlatform.icon className="w-6 h-6 shrink-0" />
                      <div className="text-left">
                        <div className="font-bold">{recommendedPlatform.recommendedLabel}</div>
                        <div className="text-sm text-white/80 font-normal">{recommendedPlatform.recommendedMeta}</div>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Platforms Section */}
      <section 
        ref={platformsRef} 
        className="py-20 md:py-32 relative overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={platformsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 tracking-tighter text-center text-white leading-[1.05]"
          >
            All Platforms
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={platformsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  <div className="bg-gray-900/60 rounded-3xl p-8 border border-gray-800/60 hover:border-gray-700/80 hover:bg-gray-900/80 transition-all duration-500 h-full flex flex-col">
                    {/* Platform Icon & Name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                        <p className="text-sm text-gray-400">{platform.version}</p>
                      </div>
                    </div>

                    {/* Download Options */}
                    {platform.isAvailable ? (
                      <div className="space-y-3 flex-grow">
                        {platform.downloads.map((download, idx) => (
                          <motion.a
                            key={idx}
                            href={download.url}
                            target={platform.id === 'ios' ? '_blank' : undefined}
                            rel={platform.id === 'ios' ? 'noopener noreferrer' : undefined}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-6 py-4 rounded-xl text-left transition-all duration-300 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 text-white border border-gray-700/50 hover:border-gray-600 shadow-sm"
                          >
                            <div>
                              <div className="font-semibold text-sm text-gray-200">{download.name}</div>
                              {download.arch && <div className="text-xs text-gray-500 mt-1">{download.arch}</div>}
                            </div>
                            <Download className="w-5 h-5" />
                          </motion.a>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-grow flex-col justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                        <div className="flex items-start gap-3">
                          <Icon className="mt-0.5 w-5 h-5 shrink-0 text-emerald-400" />
                          <div>
                            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">Coming Soon</div>
                            <div className="mt-2 text-sm leading-relaxed text-gray-300">
                              Native Android support is in development and will launch on Google Play soon.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {platform.id === 'ios' && (
                      <div className="mt-4 flex items-center gap-2 text-purple-600">
                        <SiApple className="w-4 h-4" />
                        <span className="text-sm font-semibold">Available on App Store</span>
                      </div>
                    )}

                    {platform.id === 'android' && (
                      <div className="mt-4 flex items-center gap-2 text-emerald-400">
                        <SiAndroid className="w-4 h-4" />
                        <span className="text-sm font-semibold">Google Play release coming soon</span>
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
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-16 tracking-tighter text-center text-white leading-[1.05]"
          >
            System Requirements
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
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