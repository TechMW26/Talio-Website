import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { Bot, Clock, Shield, Headphones, CheckCircle2, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { createDemoBookingEmailPayload, sendDemoBookingEmail } from '@/app/components/demoBookingEmail';
import { DemoBookingStepper } from '@/app/components/DemoBookingStepper';
import { createEmptyDemoBookingForm } from '@/app/components/demoBookingTypes';
import { submitSignup, enrichVisitorFromForm } from '@/lib/firebase';
import { getPageLabelFromPath } from '@/lib/leadAttribution';

export function GetStarted() {
  usePageMeta('Get Started', 'Book a free demo of Talio and see how it can transform your workforce management.');

  const location = useLocation();

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  const [form, setForm] = useState(createEmptyDemoBookingForm());

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submissionData = {
        ...createDemoBookingEmailPayload(form, 'get-started'),
        sourcePagePath: location.pathname,
        sourcePageName: getPageLabelFromPath(location.pathname),
      };

      await submitSignup(submissionData);
      await sendDemoBookingEmail(submissionData);
      enrichVisitorFromForm({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: form.phone });

      setSubmitted(true);
      setForm(createEmptyDemoBookingForm());
    } catch {
      alert('We could not send your booking confirmation email. Please try again.');
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-950 text-white">
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 md:px-8 lg:px-12 text-center">
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
      <section ref={contentRef} className="mx-auto max-w-7xl px-4 pb-24 md:px-8 lg:px-12 lg:pb-32">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left – Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 min-w-0"
          >
            <div className="space-y-4">
              {benefits.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-gray-800/60 bg-gray-900/60 p-5 transition-all hover:border-gray-700/60 hover:bg-gray-900/80"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15">
                    <item.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="mb-1 block text-[15px] font-semibold text-white">{item.title}</span>
                    <span className="block text-[13px] leading-relaxed text-gray-400">{item.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
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
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 lg:sticky lg:top-28 min-w-0"
          >
            <div className="rounded-2xl border border-gray-700/40 bg-gray-900/80 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="p-5 sm:p-7">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <span className="block text-2xl font-bold text-white">You're all set!</span>
                    <span className="mt-3 block max-w-sm text-sm leading-relaxed text-gray-400">
                      Check your inbox for the confirmation email. Our team will reach out with next steps.
                    </span>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
                    >
                      Book another demo
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Form header */}
                    <div className="mb-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Free Demo</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Book your guided walkthrough</h2>
                      <p className="mt-2 text-[13px] sm:text-sm text-gray-400 leading-relaxed">
                        See Talio in action — tailored to your workforce setup.
                      </p>
                    </div>

                    <DemoBookingStepper
                      form={form}
                      onFieldChange={handleChange}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      submitted={submitted}
                      minDate={minDate}
                      submitLabel="Book Free Demo"
                      submittingLabel="Booking..."
                      resetKey="get-started"
                      legalNotice={
                        <p className="text-center text-[11px] leading-relaxed text-gray-500">
                          By booking a demo you agree to our{' '}
                          <Link to="/terms" className="text-gray-400 underline hover:text-white transition-colors">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-gray-400 underline hover:text-white transition-colors">
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
