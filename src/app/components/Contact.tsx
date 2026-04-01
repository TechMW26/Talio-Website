import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { MapPin, Phone, Mail, Clock, FileText, HelpCircle, MessageCircle, Send, CheckCircle2, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { submitContact, enrichVisitorFromForm } from '@/lib/firebase';

export function Contact() {
  usePageMeta('Contact', 'Get in touch with the Talio team. Reach out for sales inquiries, support, or partnership opportunities. We\'re here to help.');

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const helpRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const formInView = useInView(formRef, { once: true, margin: '-100px' });
  const infoInView = useInView(infoRef, { once: true, margin: '-100px' });
  const helpInView = useInView(helpRef, { once: true, margin: '-100px' });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact({
        ...form,
        source: 'contact-page',
        submittedAt: new Date().toISOString(),
      });
      enrichVisitorFromForm({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: form.phone });
      setSubmitted(true);
      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Phone',
      lines: [
        { label: '+91 7909 444 999', href: 'tel:+917909444999' },
        { label: '+91 9826 322 445', href: 'tel:+919826322445' },
      ],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [
        { label: 'info@talio.in', href: 'mailto:info@talio.in' },
        { label: 'support@talio.app', href: 'mailto:support@talio.app' },
      ],
    },
    {
      icon: MapPin,
      title: 'Location',
      lines: [{ label: 'Bangalore, India', href: 'https://maps.google.com/?q=Bangalore,India' }],
    },
    {
      icon: Clock,
      title: 'Hours',
      lines: [{ label: 'Monday – Saturday: 9 AM – 6 PM IST' }, { label: 'Sunday: Closed' }],
    },
  ];

  const socialLinks = [
    { icon: Twitter, label: 'X (Twitter)', href: 'https://x.com/talioapp' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/talio/' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/talioapp/' },
  ];

  const quickHelp = [
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Browse our detailed guides and API references.',
      linkText: 'View Docs',
      href: '/documents',
    },
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Find answers to frequently asked questions.',
      linkText: 'Visit Help Center',
      href: '/help',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real time.',
      linkText: 'Coming Soon',
      href: '#',
      badge: true,
    },
  ];

  const inputClass =
    'w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-blue-400 uppercase tracking-widest mb-10">
              ✦ CONTACT US
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
              Have a question, feedback, or just want to say hello? We'd love to hear from you. Reach out and our team will get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 pb-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -40 }}
            animate={formInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-gray-800 bg-gray-900 p-8 md:p-10"
          >
            <h2 className="mb-1 text-2xl font-semibold">Send Us a Message</h2>
            <p className="mb-8 text-sm text-gray-400">Fill out the form and we'll respond within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={inputClass}
                  required
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={inputClass}
                  required
                />
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={inputClass}
                required
              />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className={inputClass}
              />
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="" disabled>
                  Select Subject
                </option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Partnership">Partnership</option>
                <option value="Demo">Demo</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className={inputClass + ' resize-none'}
                required
              />
              <button
                type="submit"
                disabled={submitting || submitted}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10 disabled:opacity-60"
              >
                {submitted ? (
                  <><CheckCircle2 className="h-4 w-4" /> Message Sent!</>
                ) : submitting ? (
                  'Sending...'
                ) : (
                  <><Send className="h-4 w-4" /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, x: 40 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-5 rounded-3xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <card.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <span className="mb-1 block font-semibold text-white">{card.title}</span>
                  {card.lines.map((line, i) => (
                    line.href ? (
                      <a
                        key={i}
                        href={line.href}
                        target={line.href.startsWith('http') ? '_blank' : undefined}
                        rel={line.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block text-sm text-gray-400 transition hover:text-blue-300"
                      >
                        <span>{line.label}</span>
                      </a>
                    ) : (
                      <span key={i} className="block text-sm text-gray-400">
                        {line.label}
                      </span>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
              <span className="mb-4 block font-semibold text-white">Follow Us</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-800 bg-gray-800/50 text-gray-300 transition hover:border-blue-500/50 hover:text-white"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Help */}
      <section ref={helpRef} className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={helpInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-16 tracking-tighter leading-[1.05]">Quick Help</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {quickHelp.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-800 bg-gray-900 p-8 text-center transition hover:border-gray-700"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <item.icon className="h-6 w-6 text-blue-400" />
                </div>
                <span className="mb-2 block text-lg font-semibold text-white">{item.title}</span>
                <span className="mb-4 block text-sm text-gray-400">{item.description}</span>
                {item.badge ? (
                  <span className="inline-block rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-400">
                    Coming Soon
                  </span>
                ) : item.href.startsWith('/') ? (
                  <Link
                    to={item.href}
                    className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                  >
                    {item.linkText} →
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
                  >
                    {item.linkText} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
