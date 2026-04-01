import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { BookDemoPopup, type PlanInfo } from './BookDemoPopup';
import { ElfsightReviewsSection } from './ElfsightReviewsSection';
import { PricingChangeConfetti } from './PricingChangeConfetti';
import { pricingFaqs, pricingPlans } from './pricingData';

const PLAN_CONFETTI_COLORS: Record<string, string[]> = {
  Budget: ['bg-emerald-300', 'bg-teal-300', 'bg-cyan-300', 'bg-white'],
  Starter: ['bg-sky-300', 'bg-blue-300', 'bg-cyan-200', 'bg-white'],
  Professional: ['bg-violet-300', 'bg-fuchsia-300', 'bg-pink-300', 'bg-white'],
  Enterprise: ['bg-orange-300', 'bg-amber-300', 'bg-red-300', 'bg-white'],
};

export function MobilePricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [priceCelebrationKey, setPriceCelebrationKey] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const plansSectionRef = useRef<HTMLElement | null>(null);
  const hasMountedBillingRef = useRef(false);

  const scrollPlansIntoView = () => {
    if (!plansSectionRef.current) {
      return;
    }

    const targetTop = plansSectionRef.current.getBoundingClientRect().top + window.scrollY - 6.5 * 16;

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

  const openDemoForPlan = (plan: typeof pricingPlans[number]) => {
    const priceDisplay = plan.priceLabel ?? `₹${billing === 'monthly' ? plan.price.monthly : plan.price.annual}${plan.period}`;
    setSelectedPlan({
      name: plan.name,
      price: priceDisplay,
      gradient: plan.gradient,
    });
    setShowDemoPopup(true);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    let frameId = 0;

    const updateActivePlan = () => {
      const cards = Array.from(slider.querySelectorAll<HTMLElement>('[data-plan-card]'));
      if (cards.length === 0) {
        return;
      }

      const viewportCenter = slider.scrollLeft + slider.clientWidth / 2;
      let nextActiveIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          nextActiveIndex = index;
        }
      });

      setActivePlanIndex(nextActiveIndex);
    };

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateActivePlan);
    };

    updateActivePlan();
    slider.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActivePlan);

    return () => {
      cancelAnimationFrame(frameId);
      slider.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActivePlan);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedBillingRef.current) {
      hasMountedBillingRef.current = true;
      return;
    }

    setPriceCelebrationKey((current) => current + 1);
  }, [billing]);

  const jumpToPlan = (index: number) => {
    const slider = sliderRef.current;
    const targetCard = slider?.querySelectorAll<HTMLElement>('[data-plan-card]')[index];

    if (!slider || !targetCard) {
      return;
    }

    slider.scrollTo({
      left: targetCard.offsetLeft - (slider.clientWidth - targetCard.clientWidth) / 2,
      behavior: 'auto',
    });
    setActivePlanIndex(index);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <section className="relative overflow-hidden px-4 pt-32 pb-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mobile-hero-stack flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mobile-hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400"
          >
            ✦ Pricing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-hero-title text-5xl font-bold tracking-tighter leading-[0.98]"
          >
            Simple, Transparent
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Pricing
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mobile-hero-copy max-w-md text-base font-light leading-relaxed text-gray-400"
          >
            Talio is priced for operational value, so growing teams can replace fragmented attendance, coordination, reporting, and HR tools with one daily-use utility.
          </motion.p>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mb-10 flex flex-col items-center gap-3 px-4"
      >
        <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_1rem_2.5rem_-1.75rem_rgba(0,0,0,0.85)]">
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
            Monthly
          </span>
          <SwitchPrimitive.Root
            checked={billing === 'annual'}
            onCheckedChange={(checked) => handleBillingChange(checked ? 'annual' : 'monthly')}
            aria-label="Billing frequency"
            className="relative flex h-9 w-[4.125rem] items-center rounded-full border border-white/10 bg-[#182132] p-1 outline-none transition-colors duration-300 data-[state=checked]:bg-[#1c2538] focus-visible:ring-2 focus-visible:ring-purple-500/50"
          >
            <SwitchPrimitive.Thumb asChild>
              <motion.span
                className="block h-7 w-7 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 shadow-[0_0.625rem_1.875rem_rgba(192,38,211,0.45)]"
                animate={{ x: billing === 'annual' ? 33 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            </SwitchPrimitive.Thumb>
          </SwitchPrimitive.Root>
          <span className={`text-sm font-medium ${billing === 'annual' ? 'text-white' : 'text-gray-500'}`}>
            Annual
          </span>
        </div>

        <motion.div
          animate={{
            opacity: billing === 'annual' ? 1 : 0.72,
            scale: billing === 'annual' ? 1 : 0.98,
          }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${billing === 'annual' ? 'border-green-500/30 bg-green-500/12 text-green-400' : 'border-white/10 bg-white/[0.03] text-gray-500'}`}
        >
          20% off with annual billing
        </motion.div>
      </motion.div>

      <section ref={plansSectionRef} className="pt-2 pb-20">
        <div className="mb-4 px-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Swipe to compare plans
          </span>
        </div>

        <div ref={sliderRef} className="overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory', scrollPaddingInline: '1rem' }}>
          <div className="flex gap-4 pl-4 pr-0">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              const priceDisplay = plan.priceLabel ?? `₹${billing === 'monthly' ? plan.price.monthly : plan.price.annual}`;
              const isActive = activePlanIndex === index;
              const confettiColors = PLAN_CONFETTI_COLORS[plan.name] ?? PLAN_CONFETTI_COLORS.Professional;

              return (
                <motion.div
                  key={plan.name}
                  data-plan-card
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, scale: isActive ? 1 : 0.965 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className={`w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] snap-center ${plan.badge ? 'pt-5' : ''}`}
                >
                  <div className={`relative h-full rounded-[2.25rem] border ${isActive ? 'border-white/20 shadow-[0_0_2.5rem_rgba(255,255,255,0.06)]' : plan.featured ? 'border-purple-500/30' : 'border-white/10'} bg-gray-950/85 p-6`}> 
                    {plan.badge && (
                      <span className={`absolute -top-3 left-5 rounded-full bg-gradient-to-r ${plan.gradient} px-4 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white`}>
                        {plan.badge}
                      </span>
                    )}

                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.gradient}`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <span className="mt-6 block text-2xl font-bold tracking-tight text-white">{plan.name}</span>
                    <span className="mt-2 block text-sm text-gray-400">{plan.subtitle}</span>

                    <div className="relative mt-6 min-h-[4.75rem] overflow-visible">
                      <PricingChangeConfetti triggerKey={priceCelebrationKey} colors={confettiColors} className="inset-x-0 top-0 h-24" />

                      <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.name}-${billing}`}
                            initial={{ opacity: 0, y: 14, scale: 0.92, filter: 'blur(0.25rem)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0rem)' }}
                            exit={{ opacity: 0, y: -14, scale: 0.92, filter: 'blur(0.25rem)' }}
                            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                            className="block text-5xl font-bold tracking-tighter text-white"
                          >
                            {priceDisplay}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      <div className="mt-1 overflow-hidden text-sm text-gray-500">
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

                    <button
                      type="button"
                      onClick={() => openDemoForPlan(plan)}
                      className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition ${
                        plan.featured ? 'bg-white text-black hover:bg-gray-100' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature.name} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient}`}>
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                              <X className="h-3 w-3 text-gray-600" strokeWidth={3} />
                            </div>
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div className="h-px w-4 shrink-0" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 px-4">
          {pricingPlans.map((plan, index) => {
            const isActive = activePlanIndex === index;

            return (
              <button
                key={plan.name}
                type="button"
                aria-label={`Show ${plan.name} plan`}
                aria-pressed={isActive}
                onClick={() => jumpToPlan(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? 'w-8 bg-white' : 'w-2.5 bg-white/25'}`}
              />
            );
          })}
        </div>
      </section>

      <ElfsightReviewsSection
        sectionClassName="relative bg-black pb-10 overflow-hidden"
        containerClassName="mx-auto max-w-7xl px-4 md:px-8 lg:px-12"
        eyebrow="✦ Google Reviews"
        title="What Teams Are Saying"
        subtitle="Live Google reviews from teams already running Talio in daily operations."
      />

      <section className="px-4 pb-20">
        <div className="rounded-[2.5rem] border border-white/10 bg-gray-950/80 p-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">✦ FAQ</span>
            <span className="mt-5 block text-3xl font-bold tracking-tighter text-white">Questions, answered</span>
            <span className="mt-4 block text-sm font-light leading-relaxed text-gray-400">
              Everything you need to know about Talio pricing and plans.
            </span>
          </div>

          <div className="mt-8 space-y-3">
            {pricingFaqs.map((faq, index) => (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white">{faq.question}</span>
                  <motion.span animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <span className="block px-5 pb-4 text-sm leading-relaxed text-gray-400">{faq.answer}</span>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-gray-950 to-[#0c1324] p-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Custom plan</span>
          <span className="mt-5 block text-3xl font-bold tracking-tighter text-white">Need something tailored?</span>
          <span className="mt-4 block text-sm font-light leading-relaxed text-gray-400">
            We can shape deployment, support, and integrations around your team.
          </span>
          <Link
            to="/contact"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100"
          >
            <span>Contact Sales</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <BookDemoPopup
        isOpen={showDemoPopup}
        onClose={() => { setShowDemoPopup(false); setSelectedPlan(null); }}
        planInfo={selectedPlan}
      />
    </div>
  );
}