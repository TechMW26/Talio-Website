import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Clock, Calendar, DollarSign, LayoutGrid, Target, Sparkles, Bot, MessageSquare, Bell, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router';
import React from 'react';
import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';
import { BookDemoPopup } from './BookDemoPopup';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    
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

  const navItems = [
    { name: 'Mira', href: '/old-site/index.html', isRoute: true, reloadDocument: true, gradient: true },
    { name: 'Features', href: '/features', isRoute: true },
    { name: 'Pricing', href: '/pricing', isRoute: true },
    { name: 'Downloads', href: '/downloads', isRoute: true },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Contact', href: '/contact', isRoute: true }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 md:py-4'
          : 'py-4 md:py-6'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-16">
        <motion.div 
          className={`
            relative rounded-full transition-all duration-500
            ${isScrolled 
              ? 'bg-black/80 backdrop-blur-2xl shadow-lg shadow-black/5 border border-gray-800/50' 
              : 'bg-transparent'
            }
          `}
        >
          <div className="px-8 py-4 flex items-center justify-between">
            {/* Logo */}
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

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2 relative">
              {navItems.map((item, index) => {
                // Special handling for Features with dropdown
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
                        <motion.div
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-1/2 transition-all duration-300"
                        />
                      </motion.div>

                      {/* Features Mega Menu */}
                      <AnimatePresence>
                        {showFeaturesDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[920px]"
                          >
                            {/* Invisible bridge */}
                            <div className="absolute -top-4 left-0 right-0 h-4" />

                            {/* Outer glow ring */}
                            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-gray-700/60 via-gray-800/30 to-gray-900/20">
                              {/* Background ambient glows */}
                              <div className="absolute -top-20 left-1/4 w-60 h-60 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute -top-16 right-1/4 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

                              <div className="bg-[#0c0e14]/95 backdrop-blur-2xl rounded-[20px] overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.7)]">
                                <div className="grid grid-cols-3">

                                  {/* PRODUCTIVITY */}
                                  <div className="p-5 relative">
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(96,165,250,0.4)]" />
                                      <h3 className="text-[10px] font-bold text-blue-400/80 uppercase tracking-[0.2em]">
                                        Productivity
                                      </h3>
                                    </div>
                                    <div className="space-y-0.5">
                                      <FeatureItem icon={LayoutGrid} title="Talio Projects" description="Kanban-style project management" accentColor="indigo" href="/features/projects" delay={0} />
                                      <FeatureItem icon={Target} title="Goals & OKRs" description="Set and track company objectives" accentColor="cyan" href="/features/goals" delay={0.03} />
                                      <FeatureItem icon={Sparkles} title="AI Workflows" description="Automate repetitive tasks" accentColor="amber" href="/features/workflows" delay={0.06} />
                                    </div>
                                  </div>

                                  {/* COMMUNICATION */}
                                  <div className="p-5 relative border-x border-white/[0.04]">
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_2px_rgba(244,114,182,0.4)]" />
                                      <h3 className="text-[10px] font-bold text-pink-400/80 uppercase tracking-[0.2em]">
                                        Communication
                                      </h3>
                                    </div>
                                    <div className="space-y-0.5">
                                      <FeatureItem icon={Bot} title="Mira" description="Embedded intelligence for daily workflows" accentColor="violet" href="/features/mira-ai" delay={0.04} badge="New" />
                                      <FeatureItem icon={MessageSquare} title="Team Chat" description="Real-time messaging and channels" accentColor="pink" href="/features/team-chat" delay={0.07} />
                                      <FeatureItem icon={Bell} title="Notifications" description="Stay updated with real-time alerts" accentColor="orange" href="/features/notifications" delay={0.1} />
                                    </div>
                                  </div>

                                  {/* HRMS ADD-ONS */}
                                  <div className="p-5 relative">
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_2px_rgba(168,85,247,0.4)]" />
                                      <h3 className="text-[10px] font-bold text-purple-400/80 uppercase tracking-[0.2em]">
                                        HRMS Add-Ons
                                      </h3>
                                    </div>
                                    <div className="space-y-0.5">
                                      <FeatureItem icon={Clock} title="Smart Attendance" description="GPS-enabled check-ins with geofencing" accentColor="purple" href="/features/attendance" delay={0.05} />
                                      <FeatureItem icon={DollarSign} title="Automated Payroll" description="Calculate salaries and generate payslips" accentColor="blue" href="/features/payroll" delay={0.08} />
                                      <FeatureItem icon={Calendar} title="Leave Management" description="Smart leave tracking and approvals" accentColor="emerald" href="/features/leaves" delay={0.11} />
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom CTA bar */}
                                <div className="border-t border-white/[0.05] px-6 py-3 flex items-center justify-between bg-white/[0.02]">
                                  <Link to="/features" className="group/cta flex items-center gap-2 text-[13px] text-gray-400 hover:text-white transition-all duration-300 font-medium">
                                    <Zap className="w-3.5 h-3.5 text-purple-400 group-hover/cta:text-purple-300 transition-colors" />
                                    Explore all features
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform duration-300" />
                                  </Link>
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    9 features available
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

                // Regular menu items
                return item.isRoute ? (
                  <Link key={item.name} to={item.href} reloadDocument={Boolean((item as any).reloadDocument)}>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2.5 text-base transition-colors duration-300 rounded-full hover:bg-gray-800 relative group cursor-pointer ${
                        (item as any).gradient ? '' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {(item as any).gradient ? (
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                          {item.name}
                        </span>
                      ) : (
                        item.name
                      )}
                      <motion.div
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/2 transition-all duration-300 ${
                          (item as any).gradient ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400' : 'bg-white'
                        }`}
                      />
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.href)}
                    className="px-6 py-2.5 text-base text-gray-300 hover:text-white transition-colors duration-300 rounded-full hover:bg-gray-800 relative group cursor-pointer"
                  >
                    {item.name}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white rounded-full group-hover:w-1/2 transition-all duration-300"
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
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
                      {"Start Today".split('').map((char, i) => (
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

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors text-white"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden absolute top-full left-8 right-8 mt-4"
            >
              <div className="bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-gray-800 shadow-2xl p-8 overflow-hidden">
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -z-10" />
                
                <div className="space-y-2 mb-8">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {item.isRoute ? (
                        <Link
                          to={item.href}
                          reloadDocument={Boolean((item as any).reloadDocument)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-6 py-4 text-lg font-medium hover:bg-gray-800 rounded-2xl transition-all duration-300 ${
                            (item as any).gradient ? '' : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          {(item as any).gradient ? (
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                              {item.name}
                            </span>
                          ) : item.name}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => handleNavigation(item.href)}
                          className="block px-6 py-4 text-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-2xl transition-all duration-300"
                        >
                          {item.name}
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-3"
                >
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setShowDemoPopup(true); }}
                    className="w-full py-4 rounded-2xl text-base font-semibold border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-300"
                  >
                    Book Free Demo
                  </button>
                  <Link to="/get-started" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-7 rounded-2xl text-base font-semibold shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300">
                      Start Today
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-500/10',  glow: 'shadow-purple-500/20',  ring: 'ring-purple-500/20' },
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-500/10',    glow: 'shadow-blue-500/20',    ring: 'ring-blue-500/20' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20', ring: 'ring-emerald-500/20' },
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-500/10',  glow: 'shadow-indigo-500/20',  ring: 'ring-indigo-500/20' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10',    glow: 'shadow-cyan-500/20',    ring: 'ring-cyan-500/20' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/10',   glow: 'shadow-amber-500/20',   ring: 'ring-amber-500/20' },
  violet:  { icon: 'text-violet-400',  bg: 'bg-violet-500/10',  glow: 'shadow-violet-500/20',  ring: 'ring-violet-500/20' },
  pink:    { icon: 'text-pink-400',    bg: 'bg-pink-500/10',    glow: 'shadow-pink-500/20',    ring: 'ring-pink-500/20' },
  orange:  { icon: 'text-orange-400',  bg: 'bg-orange-500/10',  glow: 'shadow-orange-500/20',  ring: 'ring-orange-500/20' },
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
      <div className={`relative z-10 w-9 h-9 flex-shrink-0 rounded-[10px] ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center group-hover/item:shadow-lg ${colors.glow} transition-all duration-300 group-hover/item:scale-110`}>
        <Icon className={`w-[18px] h-[18px] ${colors.icon} transition-transform duration-300 group-hover/item:scale-110`} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-gray-300 group-hover/item:text-white transition-colors duration-200 leading-tight">
            {title}
          </span>
          {badge && (
            <span className="px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>
        <span className="block text-[11px] text-gray-500 group-hover/item:text-gray-400 leading-snug truncate transition-colors duration-200">
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