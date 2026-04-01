import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Check, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { BookDemoPopup, type PlanInfo } from './BookDemoPopup';
import { PricingBillingToggle } from './PricingBillingToggle';
import { PricingChangeConfetti } from './PricingChangeConfetti';
import { ElfsightReviewsSection } from './ElfsightReviewsSection';
import { pricingFaqs, pricingPlans } from './pricingData';
import { useCompensatedMinWidth } from '@/app/hooks/useZoomCompensatedViewport';

const PLAN_CONFETTI_COLORS: Record<string, string[]> = {
  Budget: ['bg-emerald-300', 'bg-teal-300', 'bg-cyan-300', 'bg-white'],
  Starter: ['bg-sky-300', 'bg-blue-300', 'bg-cyan-200', 'bg-white'],
  Professional: ['bg-violet-300', 'bg-fuchsia-300', 'bg-pink-300', 'bg-white'],
  Enterprise: ['bg-orange-300', 'bg-amber-300', 'bg-red-300', 'bg-white'],
};

export function DesktopPricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [priceCelebrationKey, setPriceCelebrationKey] = useState(0);
  const hasWidePlansGrid = useCompensatedMinWidth(1500);
  const hasMediumPlansGrid = useCompensatedMinWidth(980);

  const openDemoForPlan = (plan: typeof pricingPlans[number]) => {
    const priceDisplay = plan.priceLabel ?? `₹${billing === 'monthly' ? plan.price.monthly : plan.price.annual}${plan.period}`;
    setSelectedPlan({
      name: plan.name,
      price: priceDisplay,
      gradient: plan.gradient,
    });
    setShowDemoPopup(true);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const plansRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const hasMountedBillingRef = useRef(false);

  const scrollPlansIntoView = () => {
    if (!plansRef.current) {
      return;
    }

    const targetTop = plansRef.current.getBoundingClientRect().top + window.scrollY - 7.5 * 16;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  };

  const handleBillingChange = (nextBilling: 'monthly' | 'annual') => {
    if (nextBilling === billing) {
      return;
    }

    setBilling(nextBilling);

    if (nextBilling === 'annual') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scrollPlansIntoView);
      });
    }
  };

  useEffect(() => {
    if (!hasMountedBillingRef.current) {
      hasMountedBillingRef.current = true;
      return;
    }

    setPriceCelebrationKey((current) => current + 1);
  }, [billing]);

  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });
  const plansInView = useInView(plansRef, { once: true, margin: '-10%' });
  const faqInView = useInView(faqRef, { once: true, margin: '-10%' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-10%' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [100, -100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.25, 0.15]),
          }}
          className="absolute top-1/4 -left-1/4 w-[37.5rem] h-[37.5rem] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [-100, 100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.25, 0.15]),
          }}
          className="absolute bottom-1/4 -right-1/4 w-[31.25rem] h-[31.25rem] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative pt-40 pb-10 flex flex-col items-center text-center px-6"
      >
        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
          ✦ PRICING
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tighter text-center">
          Simple, Transparent
          <br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Pricing
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl text-center">
          Talio is priced for operational value: replace fragmented attendance, coordination, reporting, and HR tools with one daily-use productivity utility.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16 mt-6 px-6"
      >
        <PricingBillingToggle
          billing={billing}
          onChange={handleBillingChange}
          layoutId="desktop-pricing-billing-pill"
          className="w-full"
        />
      </motion.div>

      <motion.section
        ref={plansRef}
        initial={{ opacity: 0, y: 30 }}
        animate={plansInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-[96rem] px-4 pb-28 md:px-6 lg:px-8"
      >
        <div className={`grid items-stretch gap-5 pt-6 xl:gap-6 ${hasWidePlansGrid ? 'grid-cols-4' : hasMediumPlansGrid ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            const isHovered = hoveredIndex === index;
            const priceDisplay = plan.priceLabel ?? `₹${billing === 'monthly' ? plan.price.monthly : plan.price.annual}`;
            const priceClassName = plan.priceLabel
              ? 'text-[2.5rem] md:text-[2.875rem]'
              : 'text-[2.875rem] md:text-[3.375rem]';
            const confettiColors = PLAN_CONFETTI_COLORS[plan.name] ?? PLAN_CONFETTI_COLORS.Professional;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={plansInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group flex h-full flex-col pt-8"
              >
                {plan.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8, type: 'spring' }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 z-30"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 1.25rem rgba(168, 85, 247, 0.4)',
                          '0 0 2.5rem rgba(236, 72, 153, 0.6)',
                          '0 0 1.25rem rgba(168, 85, 247, 0.4)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className={`px-6 py-2 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold uppercase tracking-widest rounded-full`}
                    >
                      {plan.badge}
                    </motion.div>
                  </motion.div>
                )}

                <motion.div
                  className="pointer-events-none absolute inset-x-8 -bottom-8 h-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <div className={`h-full w-full rounded-full bg-gradient-to-r ${plan.gradient} blur-3xl`} />
                </motion.div>

                <motion.div
                  whileHover={{ y: -8 }}
                  animate={{
                    boxShadow: isHovered
                      ? plan.featured
                        ? '0 1.5rem 5rem rgba(168, 85, 247, 0.24)'
                        : '0 1.5rem 4.5rem rgba(59, 130, 246, 0.18)'
                      : plan.featured
                        ? '0 0.625rem 2rem rgba(0, 0, 0, 0.28)'
                        : '0 0.5rem 1.75rem rgba(0, 0, 0, 0.24)',
                  }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                  className={`
                    relative flex h-full flex-col rounded-[2.5rem] overflow-hidden
                    ${plan.featured
                      ? 'bg-gray-900/60 border-2 border-purple-500/30 backdrop-blur-sm p-7 xl:p-8'
                      : 'bg-gray-900/60 border border-gray-800/60 backdrop-blur-sm p-7 xl:p-8'
                    }
                    transition-shadow duration-500
                  `}
                >
                  <motion.div
                    className={`pointer-events-none absolute top-3 right-3 h-24 w-24 rounded-full bg-gradient-to-br ${plan.gradient} blur-3xl`}
                    animate={isHovered ? { scale: [1, 1.08, 1], opacity: [0.04, 0.08, 0.04] } : { opacity: 0.03 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                  />

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="relative mb-6 flex justify-center">
                      <motion.div
                        animate={isHovered ? { y: [0, -8, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="relative z-10"
                      >
                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl ${plan.gradient}`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="min-h-[6.75rem] text-center">
                      <h3 className="relative z-10 mb-2 text-2xl font-bold tracking-tight text-white">
                        {plan.name}
                      </h3>

                      <p className="relative z-10 text-sm font-light text-gray-400">
                        {plan.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 mb-7 min-h-[5.75rem] overflow-visible text-center">
                      <PricingChangeConfetti triggerKey={priceCelebrationKey} colors={confettiColors} className="inset-x-0 top-0 h-24" />

                      <div className="flex min-h-[3.75rem] items-end justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.name}-${billing}`}
                            initial={{ opacity: 0, y: 14, scale: 0.92, filter: 'blur(0.25rem)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0rem)' }}
                            exit={{ opacity: 0, y: -14, scale: 0.92, filter: 'blur(0.25rem)' }}
                            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                            className={`font-bold tracking-tighter leading-none text-white ${priceClassName}`}
                          >
                            {priceDisplay}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      <div className="mt-1 min-h-[1.25rem] overflow-hidden text-sm text-gray-500">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.name}-${billing}-period`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            className="block"
                          >
                            {plan.period || '\u00A0'}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>

                    <button onClick={() => openDemoForPlan(plan)} className="relative z-10 mb-8 block w-full">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative w-full overflow-hidden rounded-full py-4 text-center text-sm font-semibold shadow-lg group ${
                          plan.featured
                            ? 'bg-white text-black'
                            : 'border border-white/10 bg-white/10 text-white hover:bg-white/15'
                        } transition-colors`}
                      >
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${plan.gradient}`}
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <span className="flex overflow-hidden">
                            {plan.cta.split('').map((char: string, i: number) => (
                              <span key={i} className="relative inline-flex h-[1.5em] flex-col overflow-hidden">
                                <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transitionDelay: `${i * 0.025}s` }}>
                                  {char === ' ' ? '\u00A0' : char}
                                </span>
                                <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transitionDelay: `${i * 0.025}s` }}>
                                  {char === ' ' ? '\u00A0' : char}
                                </span>
                              </span>
                            ))}
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </motion.div>
                    </button>

                    <div className="relative z-10 mt-auto space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={plansInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + featureIndex * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          {feature.included ? (
                            <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}>
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-800/80">
                              <X className="h-3 w-3 text-gray-600" strokeWidth={3} />
                            </div>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                            {feature.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={isHovered ? {
                      background: [
                        'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%, transparent 100%)',
                      ],
                      backgroundPosition: ['-200% 0', '200% 0'],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <ElfsightReviewsSection
        sectionClassName="relative bg-black pb-16 md:pb-20 overflow-hidden"
        eyebrow="✦ Google Reviews"
        title="What Teams Are Saying"
        subtitle="Live Google reviews from teams already running Talio in daily operations."
      />

      <motion.section
        ref={faqRef}
        initial={{ opacity: 0, y: 30 }}
        animate={faqInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-3xl mx-auto px-6 md:px-8 lg:px-12 pb-28"
      >
        <div className="flex flex-col items-center text-center">
          <span className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            ✦ FAQ
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.05] mb-4">
            Frequently Asked
            <br />
            <span className="text-gray-500">Questions</span>
          </h2>
          <p className="text-gray-400 font-light mb-14 max-w-lg">
            Everything you need to know about Talio pricing and plans.
          </p>
        </div>
        <div className="space-y-3">
          {pricingFaqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-900/60 border border-gray-800/60 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-medium text-sm">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === i ? 'auto' : 0,
                  opacity: openFaq === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        ref={ctaRef}
        initial={{ opacity: 0, y: 30 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center text-center px-6 pb-32"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight text-center">
          Need a custom plan?
        </h3>
        <p className="text-base text-gray-400 mb-8 font-light max-w-md text-center">
          Let's build a solution tailored to your organization's needs.
        </p>
        <Link to="/contact">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 text-sm font-semibold rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              Contact Sales
              <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>
        </Link>
      </motion.section>

      <BookDemoPopup
        isOpen={showDemoPopup}
        onClose={() => { setShowDemoPopup(false); setSelectedPlan(null); }}
        planInfo={selectedPlan}
      />
    </div>
  );
}