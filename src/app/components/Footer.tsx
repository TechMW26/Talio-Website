import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Instagram, ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { AnimatedButton } from '@/app/components/AnimatedButton';
import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';
import foxMascot from '@/assets/6966dd6bb9e98b4e32d6852e29b51847da2ba9cd.png';

export function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Downloads', href: '/downloads' },
        { label: 'Solutions', href: '/solutions' },
        { label: 'MIRA AI', href: '/features/mira-ai' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Partners', href: '/partners' },
        { label: 'Contact', href: '/contact' },
        { label: 'Get Started', href: '/get-started' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Documentation', href: '/documents' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[150px]" />
        
        {/* Subtle Fox Watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.img
            src={foxMascot}
            alt=""
            className="w-[500px] h-[500px] object-contain"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">

        {/* CTA Section — Hobbes-inspired split layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="py-20 md:py-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-12 border-b border-white/5"
        >
          {/* Left side */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6 border border-white/10 rounded-full px-4 py-1.5">
              ✦ Experience Talio
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1] text-white">
              Ready to see Talio
              <br />
              in Action?
            </h2>
          </div>

          {/* Right side */}
          <div className="flex-1 md:max-w-md">
            <p className="text-base text-gray-400 font-light leading-relaxed mb-8">
              Designed for teams that need control, consistency, and measurable impact across every workforce touchpoint.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/get-started">
                <AnimatedButton label="Start Free Trial" size="sm" />
              </Link>
              <Link to="/contact">
                <AnimatedButton label="Talk to Sales" variant="secondary" size="sm" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          
          {/* Brand Column - spans 2 cols on lg */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.img
                  src={logoImage}
                  alt="Talio Logo"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-bold text-white tracking-tight">
                  Talio
                </span>
              </div>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">
                Revolutionizing workforce management with intelligent automation, real-time insights, and AI-powered assistance.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <a href="mailto:info@talio.in" className="flex items-center gap-3 text-sm text-gray-500 hover:text-white transition-colors duration-300 group">
                  <Mail className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  info@talio.in
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  Bangalore, India
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 hover:border-white/15 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + sectionIndex * 0.08 }}
            >
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-8">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.15 + sectionIndex * 0.08 + linkIndex * 0.04 
                    }}
                  >
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Stay in the loop</h4>
            <p className="text-xs text-gray-500 font-light">Get product updates and company news. No spam.</p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-colors duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600 font-light">
              © {new Date().getFullYear()} Talio. A Venture of MW Umbrella. All rights reserved.
            </p>
            
            {/* Scroll to top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-white transition-colors duration-300 group"
            >
              <span className="font-light">Back to top</span>
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/15 transition-all duration-300">
                <ArrowUp className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}