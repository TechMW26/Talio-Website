import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Download, Apple, Monitor, Smartphone, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export function Downloads() {
  const heroRef = useRef(null);
  const platformsRef = useRef(null);
  const requirementsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const platformsInView = useInView(platformsRef, { once: true, margin: "-100px" });
  const requirementsInView = useInView(requirementsRef, { once: true, margin: "-100px" });

  const [detectedPlatform, setDetectedPlatform] = useState<'windows' | 'mac' | 'ios'>('windows');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setDetectedPlatform('mac');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setDetectedPlatform('ios');
    }
  }, []);

  const platforms = [
    {
      id: 'mac',
      name: 'macOS',
      icon: Apple,
      version: 'v3.2.0',
      downloads: [
        { name: 'Apple Silicon (M-series)', arch: 'arm64' },
        { name: 'Intel (x64)', arch: 'x64' }
      ],
      gradient: 'from-gray-500 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100'
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: Monitor,
      version: 'v3.2.0',
      downloads: [
        { name: 'Windows 10/11 (64-bit)', arch: 'x64' }
      ],
      gradient: 'from-blue-500 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      id: 'ios',
      name: 'iOS',
      icon: Smartphone,
      version: 'Coming Soon',
      downloads: [
        { name: 'Coming Soon', arch: '' }
      ],
      gradient: 'from-purple-500 to-purple-700',
      bgGradient: 'from-purple-50 to-purple-100',
      comingSoon: true
    }
  ];

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
    }
  };

  return (
    <div className="bg-gray-950 dark:bg-white min-h-screen relative transition-colors duration-300">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-[90vh] flex items-center justify-center py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950/30 dark:from-gray-50 dark:via-white dark:to-purple-50/30"
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
            className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 dark:from-purple-200/40 dark:to-blue-200/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20 dark:from-blue-200/40 dark:to-purple-200/40 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-semibold text-purple-700 uppercase tracking-widest border border-purple-200/50">
              <Download className="w-4 h-4" />
              Desktop Application
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
          >
            Download Talio
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 dark:text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Get the native experience for attendance tracking, productivity monitoring, and seamless HR management.
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-xl shadow-purple-500/30 transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    {detectedPlatform === 'windows' && <Monitor className="w-6 h-6" />}
                    {detectedPlatform === 'mac' && <Apple className="w-6 h-6" />}
                    {detectedPlatform === 'ios' && <Smartphone className="w-6 h-6" />}
                    <div className="text-left">
                      <div className="font-bold">
                        Download for {detectedPlatform === 'windows' ? 'Windows' : detectedPlatform === 'mac' ? 'macOS' : 'iOS'}
                      </div>
                      <div className="text-sm text-white/80 font-normal">
                        {detectedPlatform === 'windows' ? 'Windows 10/11 (64-bit)' : detectedPlatform === 'mac' ? 'Apple Silicon & Intel' : 'Coming Soon'} • v3.2.0
                      </div>
                    </div>
                  </div>
                  <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Platforms Section */}
      <section 
        ref={platformsRef} 
        className="py-20 md:py-32 bg-white relative overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={platformsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-20 md:mb-24 tracking-tight text-center"
          >
            All Platforms
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => {
              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={platformsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-br ${platform.bgGradient} rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col`}>
                    {/* Platform Icon & Name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        {platform.id === 'mac' ? (
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                          </svg>
                        ) : (
                          (() => {
                            const Icon = platform.icon;
                            return <Icon className="w-8 h-8 text-white" />;
                          })()
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-600">{platform.version}</p>
                      </div>
                    </div>

                    {/* Download Options */}
                    <div className="space-y-3 flex-grow">
                      {platform.downloads.map((download, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={!platform.comingSoon ? { scale: 1.02, x: 4 } : {}}
                          whileTap={!platform.comingSoon ? { scale: 0.98 } : {}}
                          disabled={platform.comingSoon}
                          className={`w-full px-6 py-4 rounded-xl text-left transition-all duration-300 flex items-center justify-between ${
                            platform.comingSoon
                              ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed'
                              : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-sm">{download.name}</div>
                            {download.arch && <div className="text-xs text-gray-500 mt-1">{download.arch}</div>}
                          </div>
                          {!platform.comingSoon && <Download className="w-5 h-5" />}
                        </motion.button>
                      ))}
                    </div>

                    {platform.comingSoon && (
                      <div className="mt-4 flex items-center gap-2 text-purple-600">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-sm font-semibold">Coming Soon</span>
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
        className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-16 tracking-tight text-center"
          >
            System Requirements
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(requirements).map(([platform, data], index) => (
              <motion.div
                key={platform}
                initial={{ opacity: 0, y: 30 }}
                animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{platform}</h3>
                <ul className="space-y-4">
                  {data.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{item}</span>
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
            <p className="text-gray-600 text-lg">
              Need help? Check our{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                installation guide
              </a>{' '}
              or{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold underline">
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