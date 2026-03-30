import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Bot, Clock, Shield, Headphones, CheckCircle2, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { submitSignup } from '@/lib/firebase';

export function GetStarted() {
  usePageMeta('Get Started', 'Book a free demo of Talio and see how it can transform your workforce management.');

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    preferredDate: '',
    preferredTime: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitSignup({
        ...form,
        source: 'get-started',
        submittedAt: new Date().toISOString(),
      });

      // Send booking confirmation email
      try {
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'get-started' }),
        });
      } catch {
        // Email send failure shouldn't block the booking
      }

      setSubmitted(true);
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', jobTitle: '', industry: '', companySize: '',
        preferredDate: '', preferredTime: '',
      });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Bot,
      title: 'MIRA AI Assistant',
      description: 'Get instant answers and automate tasks with our intelligent AI assistant.',
    },
    {
      icon: Clock,
      title: 'Save 10+ Hours Weekly',
      description: 'Automate attendance, payroll, leaves, and other repetitive HR tasks.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Your data is encrypted and never shared. SOC 2 compliant infrastructure.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our team is always ready to help you succeed with Talio.',
    },
  ];

  const trustBadges = ['14-day free trial', 'No credit card required', 'Cancel anytime'];

  const inputClass =
    'w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-blue-400 uppercase tracking-widest mb-10">
              ✦ GET STARTED
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Transform Your Workforce Management
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
              Book a free demo and experience the future of HR management with Talio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two-column: Benefits + Form */}
      <section ref={contentRef} className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 pb-32">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left – Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {benefits.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-5 rounded-3xl border border-gray-800 bg-gray-900 p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <item.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="mb-1 block font-semibold text-white">{item.title}</span>
                    <span className="block text-sm text-gray-400">{item.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-6">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-gray-800 bg-gray-900 p-8 md:p-10"
          >
            <h2 className="mb-4 text-2xl font-semibold text-white">Book a Free Demo</h2>
            <p className="mb-8 text-sm text-gray-400">See Talio in action — schedule a personalized demo with our team.</p>

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
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Work Email"
                  className={inputClass}
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className={inputClass}
                  required
                />
                <input
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Job Title"
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Select Industry
                  </option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Company Size
                  </option>
                  <option value="1-10">1–10 employees</option>
                  <option value="11-50">11–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="201-500">201–500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>

              {/* Calendar Booking */}
              <div className="border border-gray-700/40 rounded-xl p-5 bg-gray-800/30">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Schedule Your Demo</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={handleChange}
                      min={minDate}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Preferred Time (IST)</label>
                    <select
                      name="preferredTime"
                      value={form.preferredTime}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="" disabled>Select Time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || submitted}
                className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10 disabled:opacity-60"
              >
                {submitted ? '✓ Demo Booked!' : submitting ? 'Booking Demo...' : 'Book Free Demo →'}
              </button>

              <p className="text-center text-xs text-gray-500">
                By booking a demo you agree to our{' '}
                <Link to="/terms" className="text-gray-400 underline hover:text-white">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gray-400 underline hover:text-white">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
