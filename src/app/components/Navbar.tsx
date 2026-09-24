import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Clock, Calendar, DollarSign, LayoutGrid, Target, Sparkles, Bot, MessageSquare, Bell, ChevronRight, ChevronLeft, Zap, Download, Info, Newspaper, Phone, type LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router';
import React from 'react';
import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';
import { BookDemoPopup } from './BookDemoPopup';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';
import { useCompensatedMinWidth } from '@/app/hooks/useZoomCompensatedViewport';
import { prefetchLatestReleasePayload } from '@/lib/latestReleaseClient';

type NavItem = {
  name: string;
  href: string;
  reloadDocument?: boolean;
  gradient?: boolean;
  mobileIcon: LucideIcon;
  mobileDescription: string;
};

type FeatureLink = {
  icon: React.FC<{ className: string }>;
  title: string;
  description: string;
  accentColor: string;
  href: string;
  badge?: string;
};

type FeatureGroup = {
  title: string;
  labelClassName: string;
  dotClassName: string;
  mobileBorderClassName: string;
  mobileAuraClassName: string;
  items: FeatureLink[];
};

const NAV_ITEMS: NavItem[] = [
  {
    name: 'MIRA',
    href: '/MIRA-ai',
    gradient: true,
    mobileIcon: Bot,
    mobileDescription: 'Open the dedicated MIRA experience without leaving the site route.',
  },
  {
    name: 'Features',
    href: '/features',
    mobileIcon: LayoutGrid,
    mobileDescription: 'Browse every Talio module in a dedicated drawer.',
  },
  {
    name: 'Pricing',
    href: '/pricing',
    mobileIcon: DollarSign,
    mobileDescription: 'Compare plans and deployment options.',
  },
  {
    name: 'Downloads',
    href: '/downloads',
    mobileIcon: Download,
    mobileDescription: 'Get Talio for desktop and Android.',
  },
  {
    name: 'About',
    href: '/about',
    mobileIcon: Info,
    mobileDescription: 'See how Talio is positioned and built.',
  },
  {
    name: 'Blog',
    href: '/blog',
    mobileIcon: Newspaper,
    mobileDescription: 'Read product, team, and operations updates.',
  },
  {
    name: 'Contact',
    href: '/contact',
    mobileIcon: Phone,
    mobileDescription: 'Talk to sales or request a working session.',
  },
];

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    title: 'Productivity',
    labelClassName: 'text-blue-400/80',
    dotClassName: 'bg-blue-400 shadow-[0_0_0.5rem_rgba(96,165,250,0.45)]',
    mobileBorderClassName: 'border-blue-500/20',
    mobileAuraClassName: 'from-blue-500/18 via-blue-400/6 to-transparent',
    items: [
      { icon: LayoutGrid, title: 'Talio Projects', description: 'Kanban-style project management', accentColor: 'indigo', href: '/features/projects' },
      { icon: Target, title: 'Goals & OKRs', description: 'Set and track company objectives', accentColor: 'cyan', href: '/features/goals' },
      { icon: Sparkles, title: 'AI Workflows', description: 'Automate repetitive tasks', accentColor: 'amber', href: '/features/workflows' },
    ],
  },
  {
    title: 'Communication',
    labelClassName: 'text-pink-400/80',
    dotClassName: 'bg-pink-400 shadow-[0_0_0.5rem_rgba(244,114,182,0.45)]',
    mobileBorderClassName: 'border-pink-500/20',
    mobileAuraClassName: 'from-pink-500/18 via-fuchsia-400/6 to-transparent',
    items: [
      { icon: Bot, title: 'MIRA', description: 'Embedded intelligence for daily workflows', accentColor: 'violet', href: '/features/MIRA-ai', badge: 'New' },
      { icon: MessageSquare, title: 'Team Chat', description: 'Real-time messaging and channels', accentColor: 'pink', href: '/features/team-chat' },
      { icon: Bell, title: 'Notifications', description: 'Stay updated with real-time alerts', accentColor: 'orange', href: '/features/notifications' },
    ],
  },
  {
    title: 'HRMS Add-Ons',
    labelClassName: 'text-purple-400/80',
    dotClassName: 'bg-purple-400 shadow-[0_0_0.5rem_rgba(168,85,247,0.45)]',
    mobileBorderClassName: 'border-purple-500/20',
    mobileAuraClassName: 'from-purple-500/18 via-violet-400/6 to-transparent',
    items: [
      { icon: Clock, title: 'Smart Attendance', description: 'GPS-enabled check-ins with geofencing', accentColor: 'purple', href: '/features/attendance' },
      { icon: DollarSign, title: 'Automated Payroll', description: 'Calculate salaries and generate payslips', accentColor: 'blue', href: '/features/payroll' },
      { icon: Calendar, title: 'Leave Management', description: 'Smart leave tracking and approvals', accentColor: 'emerald', href: '/features/leaves' },
    ],
  },
];

const FEATURE_COUNT = FEATURE_GROUPS.reduce((count, group) => count + group.items.length, 0);

function prefetchDownloadsExperience() {
  void import('@/app/components/Downloads');
  prefetchLatestReleasePayload();
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFeaturesMenuOpen, setIsMobileFeaturesMenuOpen] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileViewport = useIsMobileViewport();
  const hasDesktopNavRoom = useCompensatedMinWidth(1024);
  const hasWideMegaMenu = useCompensatedMinWidth(1440);
  const shouldUseMobileNav = isMobileViewport || !hasDesktopNavRoom;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobilePanels = () => {
    setIsMobileFeaturesMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    closeMobilePanels();

    if (href.startsWith('#')) {
      // It's a section scroll
      if (location.pathname !== '/') {
        // Navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // Already on home, just scroll
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      // It's a route navigation
      navigate(href);
    }
  };

  useEffect(() => {
    closeMobilePanels();
    setShowFeaturesDropdown(false);
  }, [location.pathname]);

  const isAnyMobilePanelOpen = isMobileMenuOpen || isMobileFeaturesMenuOpen;

  useEffect(() => {
    if (!isAnyMobilePanelOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAnyMobilePanelOpen]);

  useEffect(() => {
    if (!isAnyMobilePanelOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobilePanels();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyMobilePanelOpen]);

  const toggleMobileMenu = () => {
    if (isAnyMobilePanelOpen) {
      closeMobilePanels();
      return;
    }

    setIsMobileMenuOpen(true);
  };

  const openMobileFeaturesMenu = () => {
    setIsMobileMenuOpen(true);
    setIsMobileFeaturesMenuOpen(true);
  };

  const mobileHeaderElevated = isScrolled || isAnyMobilePanelOpen;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {shouldUseMobileNav ? (
        <>
          <motion.div
            className={`relative z-[60] w-full transition-all duration-500 ${mobileHeaderElevated
                ? 'border-b border-white/10 bg-black/70 backdrop-blur-2xl shadow-[0_1.125rem_2.75rem_-2.125rem_rgba(0,0,0,0.92)]'
                : 'border-b border-white/[0.04] bg-gradient-to-b from-black/45 via-black/20 to-transparent backdrop-blur-xl'
              }`}
          >
            <div className="flex items-center justify-between px-4 py-3.5">
              <motion.div
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer"
              >
                <motion.img
                  src={logoImage}
                  alt="Talio Logo"
                  whileHover={{ rotate: 12, scale: 1.05 }}
                  transition={{ duration: 0.35 }}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-normal tracking-tight text-white">
                  Talio
                </span>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className={`flex h-11 w-11 items-center justify-center rounded-full border text-white transition-all duration-300 ${isAnyMobilePanelOpen
                    ? 'border-white/18 bg-white/[0.08]'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                aria-label={isAnyMobilePanelOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {isAnyMobilePanelOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={closeMobilePanels}
                  className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
                />

                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-y-0 right-0 z-50 w-[78vw] max-w-xs overflow-hidden border-l border-white/8 bg-[#0a0a0f]"
                >
                  <div className="flex h-full flex-col pb-6 pt-[5.5rem]">
                    <div className="flex-1 overflow-y-auto px-4">
                      <div className="space-y-1">
                        {NAV_ITEMS.map((item, index) => {
                          const Icon = item.mobileIcon;

                          if (item.name === 'Features') {
                            return (
                              <motion.button
                                key={item.name}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.28, delay: index * 0.04 }}
                                type="button"
                                onClick={openMobileFeaturesMenu}
                                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-white/[0.06]"
                              >
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white">
                                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                                </div>
                                <span className="flex-1 text-[0.9375rem] font-medium text-white">{item.name}</span>
                                <ChevronRight className="h-4 w-4 text-gray-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-400" />
                              </motion.button>
                            );
                          }

                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: 24 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 12 }}
                              transition={{ duration: 0.28, delay: index * 0.04 }}
                            >
                              <Link
                                to={item.href}
                                reloadDocument={Boolean(item.reloadDocument)}
                                onClick={closeMobilePanels}
                                onPointerEnter={item.href === '/downloads' ? prefetchDownloadsExperience : undefined}
                                onFocus={item.href === '/downloads' ? prefetchDownloadsExperience : undefined}
                                className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-white/[0.06]"
                              >
                                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white ${item.gradient
                                    ? 'bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-blue-500/12'
                                    : 'bg-white/[0.06]'
                                  }`}>
                                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                                </div>
                                <span className={`text-[0.9375rem] font-medium ${item.gradient ? 'bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent' : 'text-white'}`}>
                                  {item.name}
                                </span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="px-4 pt-4 space-y-2.5">
                      <button
                        onClick={() => {
                          closeMobilePanels();
                          setShowDemoPopup(true);
                        }}
                        className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition-colors duration-200 hover:border-white/16 hover:text-white"
                      >
                        Book Free Demo
                      </button>
                      <Link to="/get-started" onClick={closeMobilePanels}>
                        <Button className="mt-0 h-auto w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-gray-100">
                          <span className="flex items-center gap-2">
                            <span>Start Today</span>
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.aside>

                <AnimatePresence>
                  {isMobileFeaturesMenuOpen && (
                    <motion.aside
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed inset-y-0 right-0 z-[55] w-[84vw] max-w-xs overflow-hidden border-l border-white/8 bg-[#0a0a0f]"
                    >
                      <div className="flex h-full flex-col pb-6 pt-[5.5rem]">
                        <div className="px-4">
                          <button
                            type="button"
                            onClick={() => setIsMobileFeaturesMenuOpen(false)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-white"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </button>
                        </div>

                        <div className="mt-4 flex-1 overflow-y-auto px-4">
                          <div className="space-y-5">
                            {FEATURE_GROUPS.map((group, groupIndex) => (
                              <motion.div
                                key={group.title}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.28, delay: groupIndex * 0.04 }}
                              >
                                <div className="mb-2 flex items-center gap-2 px-1">
                                  <div className={`h-1.5 w-1.5 rounded-full ${group.dotClassName}`} />
                                  <span className={`text-[0.625rem] font-semibold uppercase tracking-[0.2em] ${group.labelClassName}`}>
                                    {group.title}
                                  </span>
                                </div>

                                <div className="space-y-0.5">
                                  {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                      <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={closeMobilePanels}
                                        className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                                      >
                                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${ACCENT_COLORS[item.accentColor]?.bg ?? ACCENT_COLORS.purple.bg} ring-1 ${ACCENT_COLORS[item.accentColor]?.ring ?? ACCENT_COLORS.purple.ring}`}>
                                          <Icon className={`h-4 w-4 ${ACCENT_COLORS[item.accentColor]?.icon ?? ACCENT_COLORS.purple.icon}`} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-white">
                                            {item.title}
                                          </span>
                                          {item.badge && (
                                            <span className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1.5 py-[0.0625rem] text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-white">
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="px-4 pt-4">
                          <Link
                            to="/features"
                            onClick={closeMobilePanels}
                            className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-black transition-colors duration-200 hover:bg-gray-100"
                          >
                            <span className="text-sm font-semibold">View all features</span>
                            <div className="flex items-center gap-2 text-sm text-black/55">
                              <span>{FEATURE_COUNT}</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>
              </>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className={`mx-auto max-w-[88rem] px-6 transition-all duration-500 md:px-8 lg:px-12 ${isScrolled ? 'pt-3 md:pt-4' : 'pt-4 md:pt-6'
          }`}>
          <motion.div
            className={`relative rounded-full transition-all duration-500 ${isScrolled
                ? 'bg-black/80 backdrop-blur-2xl shadow-lg shadow-black/5 border border-gray-800/50'
                : 'bg-transparent'
              }`}
          >
            <div className="px-8 py-4 flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-2.5 cursor-pointer relative z-10"
              >
                <motion.img
                  src={logoImage}
                  alt="Talio Logo"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="h-7 w-7 object-contain"
                />
                <span className="text-2xl font-normal text-white tracking-tight">
                  Talio
                </span>
              </motion.div>

              <div className="flex items-center gap-2 relative">
                {NAV_ITEMS.map((item, index) => {
                  if (item.name === 'Features') {
                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => setShowFeaturesDropdown(true)}
                        onMouseLeave={() => setShowFeaturesDropdown(false)}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNavigation(item.href)}
                          className="px-6 py-2.5 text-base text-gray-300 hover:text-white transition-colors duration-300 rounded-full hover:bg-gray-800 relative group cursor-pointer"
                        >
                          {item.name}
                          <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-1/2 transition-all duration-300" />
                        </motion.div>

                        <AnimatePresence>
                          {showFeaturesDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.96 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className={`absolute top-full mt-4 ${hasWideMegaMenu ? 'left-1/2 -translate-x-1/2 w-[min(57.5rem,calc(100vw-4rem))]' : 'left-0 w-[min(48.75rem,calc(100vw-4rem))]'}`}
                            >
                              <div className="absolute -top-4 left-0 right-0 h-4" />

                              <div className="relative rounded-[1.25rem] p-[0.0625rem] bg-gradient-to-b from-gray-700/60 via-gray-800/30 to-gray-900/20">
                                <div className="absolute -top-20 left-1/4 w-60 h-60 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -top-16 right-1/4 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

                                <div className="bg-[#0c0e14]/95 backdrop-blur-2xl rounded-[1.25rem] overflow-hidden shadow-[0_1.5625rem_3.75rem_-0.75rem_rgba(0,0,0,0.7)]">
                                  <div className={`grid ${hasWideMegaMenu ? 'grid-cols-3' : 'grid-cols-2'}`}>
                                    {FEATURE_GROUPS.map((group, groupIndex) => (
                                      <div
                                        key={group.title}
                                        className={`relative p-5 ${hasWideMegaMenu && groupIndex === 1 ? 'border-x border-white/[0.04]' : ''} ${!hasWideMegaMenu && groupIndex === 2 ? 'col-span-2 border-t border-white/[0.04]' : ''}`}
                                      >
                                        <div className="flex items-center gap-2 mb-4 px-2">
                                          <div className={`w-1.5 h-1.5 rounded-full ${group.dotClassName}`} />
                                          <h3 className={`text-[0.625rem] font-bold uppercase tracking-[0.2em] ${group.labelClassName}`}>
                                            {group.title}
                                          </h3>
                                        </div>
                                        <div className="space-y-0.5">
                                          {group.items.map((feature, featureIndex) => (
                                            <FeatureItem
                                              key={feature.href}
                                              icon={feature.icon}
                                              title={feature.title}
                                              description={feature.description}
                                              accentColor={feature.accentColor}
                                              href={feature.href}
                                              badge={feature.badge}
                                              delay={groupIndex * 0.04 + featureIndex * 0.03}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="border-t border-white/[0.05] px-6 py-3 flex items-center justify-between bg-white/[0.02]">
                                    <Link to="/features" className="group/cta flex items-center gap-2 text-[0.8125rem] text-gray-400 hover:text-white transition-all duration-300 font-medium">
                                      <Zap className="w-3.5 h-3.5 text-purple-400 group-hover/cta:text-purple-300 transition-colors" />
                                      Explore all features
                                      <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                    <div className="flex items-center gap-1.5 text-[0.6875rem] text-gray-600">
                                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                      {FEATURE_COUNT} features available
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      reloadDocument={Boolean(item.reloadDocument)}
                      onPointerEnter={item.href === '/downloads' ? prefetchDownloadsExperience : undefined}
                      onFocus={item.href === '/downloads' ? prefetchDownloadsExperience : undefined}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2.5 text-base transition-colors duration-300 rounded-full hover:bg-gray-800 relative group cursor-pointer ${item.gradient ? '' : 'text-gray-300 hover:text-white'
                          }`}
                      >
                        {item.gradient ? (
                          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                            {item.name}
                          </span>
                        ) : (
                          item.name
                        )}
                        <motion.div
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/2 transition-all duration-300 ${item.gradient ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400' : 'bg-white'
                            }`}
                        />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDemoPopup(true)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 rounded-full border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                >
                  Book Free Demo
                </motion.button>
                <MagneticButton>
                  <Link to="/get-started">
                    <Button className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full text-sm font-semibold shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 group relative overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="flex overflow-hidden">
                          {'Start Today'.split('').map((char, i) => (
                            <span key={i} className="relative inline-flex flex-col h-[1.5em] overflow-hidden">
                              <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transitionDelay: `${i * 0.025}s` }}>
                                {char === ' ' ? '\u00A0' : char}
                              </span>
                              <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transitionDelay: `${i * 0.025}s` }}>
                                {char === ' ' ? '\u00A0' : char}
                              </span>
                            </span>
                          ))}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Book Demo Popup */}
      <BookDemoPopup isOpen={showDemoPopup} onClose={() => setShowDemoPopup(false)} />
    </motion.nav>
  );
}

// Magnetic Button Component
function MagneticButton({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Accent color config for FeatureItem
const ACCENT_COLORS: Record<string, { icon: string; bg: string; glow: string; ring: string }> = {
  purple: { icon: 'text-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20', ring: 'ring-purple-500/20' },
  blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20', ring: 'ring-blue-500/20' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20', ring: 'ring-emerald-500/20' },
  indigo: { icon: 'text-indigo-400', bg: 'bg-indigo-500/10', glow: 'shadow-indigo-500/20', ring: 'ring-indigo-500/20' },
  cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20', ring: 'ring-cyan-500/20' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20', ring: 'ring-amber-500/20' },
  violet: { icon: 'text-violet-400', bg: 'bg-violet-500/10', glow: 'shadow-violet-500/20', ring: 'ring-violet-500/20' },
  pink: { icon: 'text-pink-400', bg: 'bg-pink-500/10', glow: 'shadow-pink-500/20', ring: 'ring-pink-500/20' },
  orange: { icon: 'text-orange-400', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20', ring: 'ring-orange-500/20' },
};

// FeatureItem Component
function FeatureItem({ icon: Icon, title, description, accentColor, href, delay = 0, badge }: {
  icon: React.FC<{ className: string }>;
  title: string;
  description: string;
  accentColor: string;
  href?: string;
  delay?: number;
  badge?: string;
}) {
  const colors = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group/item relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/[0.04]"
    >
      {/* Hover glow behind icon */}
      <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl ${colors.bg} opacity-0 group-hover/item:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none`} />

      {/* Icon container */}
      <div className={`relative z-10 w-9 h-9 flex-shrink-0 rounded-[0.625rem] ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center group-hover/item:shadow-lg ${colors.glow} transition-all duration-300 group-hover/item:scale-110`}>
        <Icon className={`w-[1.125rem] h-[1.125rem] ${colors.icon} transition-transform duration-300 group-hover/item:scale-110`} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[0.8125rem] font-semibold text-gray-300 group-hover/item:text-white transition-colors duration-200 leading-tight">
            {title}
          </span>
          {badge && (
            <span className="px-1.5 py-[0.0625rem] text-[0.5625rem] font-bold uppercase tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>
        <span className="block text-[0.6875rem] text-gray-500 group-hover/item:text-gray-400 leading-snug truncate transition-colors duration-200">
          {description}
        </span>
      </div>

      {/* Hover arrow */}
      <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover/item:text-gray-400 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-300 flex-shrink-0" />
    </motion.div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
}