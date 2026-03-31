import { ArrowRight, ArrowUp, Instagram, Linkedin, Mail, MapPin, Twitter } from 'lucide-react';
import { Link } from 'react-router';
import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';

const quickLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Docs', href: '/documents' },
  { label: 'Contact', href: '/contact' },
  { label: 'Help Center', href: '/help' },
  { label: 'Blog', href: '/blog' },
];

const socialLinks = [
  { icon: Twitter, href: 'https://x.com/talioapp', label: 'X' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/talio/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/talioapp/', label: 'Instagram' },
];

export function MobileFooter() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative w-full px-4 pb-10 pt-8">
        <div className="w-full rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(88,80,236,0.14),transparent_40%),linear-gradient(180deg,#0f1016_0%,#06070b_100%)] p-4 shadow-[0_0_40px_rgba(37,99,235,0.08)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            ✦ Experience Talio
          </span>
          <span className="mt-4 block text-[2rem] font-bold tracking-tighter leading-[1.02] text-white">
            Ready to see Talio in action?
          </span>
          <span className="mt-3 block text-sm font-light leading-relaxed text-gray-400">
            Built for teams that need clarity, speed, and measurable control across every workforce touchpoint.
          </span>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/get-started"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <span>Talk to Sales</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 w-full rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Talio logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight text-white">Talio</span>
          </div>

          <span className="mt-4 block text-sm font-light leading-relaxed text-gray-500">
            Revolutionizing workforce management with intelligent automation, real-time insights, and AI-assisted execution.
          </span>

          <div className="mt-5 space-y-2.5 text-sm text-gray-500">
            <a href="mailto:info@talio.in" className="flex items-center gap-3 transition hover:text-white">
              <Mail className="h-4 w-4 text-gray-600" />
              <span>info@talio.in</span>
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span>Bangalore, India</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-white/15 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-gray-400 transition hover:border-white/15 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="max-w-[220px] text-[11px] font-light leading-relaxed text-gray-600">
            © {new Date().getFullYear()} Talio. A Venture of MW FutureTech.
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-medium text-gray-400 transition hover:text-white"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}