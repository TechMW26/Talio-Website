import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Clock, Calendar, DollarSign, LayoutGrid, Target, Sparkles, Bot, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router';
import React from 'react';
import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
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
    { name: 'Features', href: '/features', isRoute: true },
    { name: 'Pricing', href: '/pricing', isRoute: true },
    { name: 'Downloads', href: '/downloads', isRoute: true },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Contact', href: '/contact', isRoute: true },
    { name: 'MIRA AI', href: '/mira-ai', isRoute: true, gradient: true }
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
              className="flex items-center gap-3 cursor-pointer relative z-10"
            >
              <motion.img
                src={logoImage}
                alt="Talio Logo"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-11 h-11 object-contain"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
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

                      {/* Features Dropdown */}
                      <AnimatePresence>
                        {showFeaturesDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[820px]"
                          >
                            {/* Invisible bridge to prevent gap hover-out */}
                            <div className="absolute -top-4 left-0 right-0 h-4" />
                            <div className="bg-[#111318] rounded-2xl shadow-2xl shadow-black/50 border border-gray-800/80 overflow-hidden">
                              <div className="grid grid-cols-3 divide-x divide-gray-800/60">
                                {/* CORE FEATURES */}
                                <div className="p-6">
                                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-5 px-1">
                                    Core Features
                                  </h3>
                                  <div className="space-y-1">
                                    <FeatureItem
                                      icon={Clock}
                                      title="Smart Attendance"
                                      description="GPS-enabled check-ins with geofencing"
                                      color="text-purple-400"
                                      bgColor="bg-purple-500/15"
                                      href="/features/attendance"
                                    />
                                    <FeatureItem
                                      icon={DollarSign}
                                      title="Automated Payroll"
                                      description="Calculate salaries and generate payslips"
                                      color="text-blue-400"
                                      bgColor="bg-blue-500/15"
                                      href="/features/payroll"
                                    />
                                    <FeatureItem
                                      icon={Calendar}
                                      title="Leave Management"
                                      description="Smart leave tracking and approvals"
                                      color="text-green-400"
                                      bgColor="bg-green-500/15"
                                      href="/features/leaves"
                                    />
                                  </div>
                                </div>

                                {/* PRODUCTIVITY */}
                                <div className="p-6">
                                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-5 px-1">
                                    Productivity
                                  </h3>
                                  <div className="space-y-1">
                                    <FeatureItem
                                      icon={LayoutGrid}
                                      title="Talio Projects"
                                      description="Kanban-style project management"
                                      color="text-indigo-400"
                                      bgColor="bg-indigo-500/15"
                                      href="/features/projects"
                                    />
                                    <FeatureItem
                                      icon={Target}
                                      title="Goals & OKRs"
                                      description="Set and track company objectives"
                                      color="text-cyan-400"
                                      bgColor="bg-cyan-500/15"
                                      href="/features/goals"
                                    />
                                    <FeatureItem
                                      icon={Sparkles}
                                      title="AI Workflows"
                                      description="Automate repetitive tasks"
                                      color="text-amber-400"
                                      bgColor="bg-amber-500/15"
                                      href="/features/workflows"
                                    />
                                  </div>
                                </div>

                                {/* COMMUNICATION */}
                                <div className="p-6">
                                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-5 px-1">
                                    Communication
                                  </h3>
                                  <div className="space-y-1">
                                    <FeatureItem
                                      icon={Bot}
                                      title="MIRA AI Assistant"
                                      description="Your intelligent HR companion"
                                      color="text-violet-400"
                                      bgColor="bg-violet-500/15"
                                      href="/features/mira-ai"
                                    />
                                    <FeatureItem
                                      icon={MessageSquare}
                                      title="Team Chat"
                                      description="Real-time messaging and channels"
                                      color="text-pink-400"
                                      bgColor="bg-pink-500/15"
                                      href="/features/team-chat"
                                    />
                                    <FeatureItem
                                      icon={Bell}
                                      title="Notifications"
                                      description="Stay updated with real-time alerts"
                                      color="text-orange-400"
                                      bgColor="bg-orange-500/15"
                                      href="/features/notifications"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Bottom bar */}
                              <div className="border-t border-gray-800/60 px-6 py-3.5 flex items-center justify-between bg-gray-900/40">
                                <Link to="/features" className="text-sm text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-1.5">
                                  View all features <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
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
                    <Link key={item.name} to={item.href}>
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
            <div className="hidden lg:flex items-center gap-4">
              <MagneticButton>
                <Link to="/get-started">
                <Button className="bg-white hover:bg-gray-100 text-black px-8 py-6 rounded-full text-base font-semibold shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 group relative overflow-hidden">
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
                >
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

// FeatureItem Component
function FeatureItem({ icon: Icon, title, description, color, bgColor, href }: { icon: React.FC<{ className: string }>, title: string, description: string, color: string, bgColor: string, href?: string }) {
  const content = (
    <div className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer group/item">
      <div className={`w-10 h-10 flex-shrink-0 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <h4 className="text-[13px] font-semibold text-gray-200 group-hover/item:text-white transition-colors leading-tight">
          {title}
        </h4>
        <p className="text-[12px] text-gray-500 leading-snug mt-0.5 truncate">
          {description}
        </p>
      </div>
    </div>
  );
  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
}