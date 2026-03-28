import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Check, X, ChevronDown, Sparkles, Rocket, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { usePageMeta } from '@/app/hooks/usePageMeta';
import * as SwitchPrimitive from "@radix-ui/react-switch";

const plans = [
  {
    icon: Sparkles,
    name: "Starter",
    price: { monthly: 280, annual: 224 },
    period: "/user/month",
    subtitle: "For small teams getting started",
    featured: false,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      { name: "Up to 25 employees", included: true },
      { name: "GPS attendance tracking", included: true },
      { name: "Leave management", included: true },
      { name: "Team chat", included: true },
      { name: "Mobile app access", included: true },
      { name: "Basic reports", included: true },
      { name: "AI features", included: false },
    ],
    cta: "Start Free Trial",
    ctaLink: "/get-started",
  },
  {
    icon: Rocket,
    name: "Professional",
    badge: "Most Popular",
    price: { monthly: 380, annual: 304 },
    period: "/user/month",
    subtitle: "For growing teams that need more",
    featured: true,
    gradient: "from-purple-500 to-pink-500",
    features: [
      { name: "Unlimited employees", included: true },
      { name: "GPS & geofencing", included: true },
      { name: "Auto payroll", included: true },
      { name: "Project management", included: true },
      { name: "Goals & OKRs", included: true },
      { name: "MIRA AI assistant", included: true },
      { name: "Priority support", included: true },
    ],
    cta: "Start Free Trial",
    ctaLink: "/get-started",
  },
  {
    icon: Building2,
    name: "Enterprise",
    price: { monthly: 0, annual: 0 },
    priceLabel: "Custom",
    period: "",
    subtitle: "For large organizations",
    featured: false,
    gradient: "from-orange-500 to-red-500",
    features: [
      { name: "Everything in Professional", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "SLA guarantee", included: true },
      { name: "On-premise deployment", included: true },
      { name: "Custom AI training", included: true },
      { name: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
  },
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Both Starter and Professional plans come with a 14-day free trial. No credit card required.",
  },
  {
    question: "Can I change plans anytime?",
    answer:
      "Absolutely. You can upgrade or downgrade at any time. Changes are pro-rated.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, UPI, bank transfers, and invoice payments for enterprise plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "100%. We use bank-level encryption, are GDPR compliant, and SOC2 certified. Your data is never sold.",
  },
];

export function PricingPage() {
  usePageMeta('Pricing', 'Simple, transparent pricing for teams of all sizes. Start free, upgrade when you need. Explore Talio Starter, Professional, and Enterprise plans.');

  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const plansRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const plansInView = useInView(plansRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [100, -100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.25, 0.15]),
          }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [-100, 100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.25, 0.15]),
          }}
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Hero */}
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
          Choose the plan that works for your team. Both plans include a free trial.
        </p>
      </motion.section>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center justify-center gap-3 mb-16 mt-6"
      >
        <span className={`text-sm font-medium transition-colors duration-300 ${billing === "monthly" ? "text-white" : "text-gray-500"}`}>
          Monthly
        </span>
        <SwitchPrimitive.Root
          checked={billing === "annual"}
          onCheckedChange={(checked) => setBilling(checked ? "annual" : "monthly")}
          className="relative w-14 h-8 rounded-full bg-gray-800 border border-gray-700/80 transition-colors duration-300 data-[state=checked]:bg-gray-800 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
        >
          <SwitchPrimitive.Thumb asChild>
            <motion.span
              className="block w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute',
                top: 3,
                left: billing === "annual" ? 29 : 3,
              }}
            />
          </SwitchPrimitive.Thumb>
        </SwitchPrimitive.Root>
        <span className={`text-sm font-medium transition-colors duration-300 ${billing === "annual" ? "text-white" : "text-gray-500"}`}>
          Annual
        </span>
        <AnimatePresence>
          {billing === "annual" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="ml-1 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium"
            >
              Save 20%
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Plan Cards */}
      <motion.section
        ref={plansRef}
        initial={{ opacity: 0, y: 30 }}
        animate={plansInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12 pb-28"
      >
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isHovered = hoveredIndex === index;
            const priceDisplay =
              plan.priceLabel ??
              `₹${billing === "monthly" ? plan.price.monthly : plan.price.annual}`;

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
                className={`relative group ${plan.featured ? 'md:-mt-4 md:mb-4' : 'pt-6'}`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-30"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(168, 85, 247, 0.4)",
                          "0 0 40px rgba(236, 72, 153, 0.6)",
                          "0 0 20px rgba(168, 85, 247, 0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className={`px-6 py-2 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold uppercase tracking-widest rounded-full`}
                    >
                      {plan.badge}
                    </motion.div>
                  </motion.div>
                )}

                {/* Animated Border Gradient */}
                <motion.div className="absolute -inset-[2px] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${plan.gradient} blur-sm`} />
                </motion.div>

                {/* Main Card */}
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className={`
                    relative h-full rounded-[2.5rem] overflow-hidden
                    ${plan.featured
                      ? "bg-gray-900/60 border-2 border-purple-500/30 backdrop-blur-sm p-10"
                      : "bg-gray-900/60 border border-gray-800/60 backdrop-blur-sm p-10"
                    }
                    transition-shadow duration-500
                  `}
                >
                  {/* Glassmorphic Accent */}
                  <motion.div
                    className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${plan.gradient} rounded-full blur-3xl`}
                    animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] } : { opacity: 0.06 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />

                  {/* Centered Icon */}
                  <div className="flex justify-center mb-7 relative">
                    <motion.div
                      animate={isHovered ? { y: [0, -8, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="relative z-10"
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-xl ${
                        plan.featured
                          ? `bg-gradient-to-br ${plan.gradient}`
                          : `bg-gradient-to-br ${plan.gradient}`
                      }`}>
                        <Icon className="w-8 h-8 relative z-10 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Plan Name — centered */}
                  <h3 className="text-2xl font-bold mb-2 tracking-tight relative z-10 text-white text-center">
                    {plan.name}
                  </h3>

                  {/* Description — centered */}
                  <p className="text-sm mb-8 font-light relative z-10 text-gray-400 text-center">
                    {plan.subtitle}
                  </p>

                  {/* Price — centered */}
                  <div className="mb-8 relative z-10 text-center">
                    <span className="text-5xl md:text-6xl font-bold tracking-tighter text-white">
                      {priceDisplay}
                    </span>
                    {plan.period && (
                      <span className="text-base text-gray-500 ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* CTA Button — centered */}
                  <Link to={plan.ctaLink} className="block mb-10 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-full py-4 text-sm font-semibold rounded-full overflow-hidden text-center shadow-lg group ${
                        plan.featured
                          ? "bg-white text-black"
                          : "bg-white/10 text-white border border-white/10 hover:bg-white/15"
                      } transition-colors`}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${plan.gradient}`}
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="flex overflow-hidden">
                          {plan.cta.split('').map((char: string, i: number) => (
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
                    </motion.div>
                  </Link>

                  {/* Features */}
                  <div className="space-y-4 relative z-10">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={plansInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        {feature.included ? (
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${plan.gradient}`}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-800/80">
                            <X className="w-3 h-3 text-gray-600" strokeWidth={3} />
                          </div>
                        )}
                        <span className={`text-sm ${
                          feature.included ? "text-gray-300" : "text-gray-600 line-through"
                        }`}>
                          {feature.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={isHovered ? {
                      background: [
                        "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%, transparent 100%)",
                        "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%, transparent 100%)",
                      ],
                      backgroundPosition: ["-200% 0", "200% 0"],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 100%" }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* FAQ */}
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
          {faqs.map((faq, i) => (
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
                  height: openFaq === i ? "auto" : 0,
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

      {/* Bottom CTA */}
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
    </div>
  );
}
