import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Check, X, ChevronDown, Sparkles, Rocket, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { usePageMeta } from '@/app/hooks/usePageMeta';

const plans = [
  {
    icon: Sparkles,
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    priceLabel: "$0",
    period: "/month",
    subtitle: "For small teams getting started",
    featured: false,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      { name: "Up to 10 employees", included: true },
      { name: "Basic attendance tracking", included: true },
      { name: "Leave management", included: true },
      { name: "Team chat", included: true },
      { name: "Mobile app access", included: true },
      { name: "AI features", included: false },
      { name: "Payroll automation", included: false },
    ],
    cta: "Get Started Free",
    ctaLink: "/get-started",
  },
  {
    icon: Rocket,
    name: "Professional",
    badge: "Most Popular",
    price: { monthly: 12, annual: 10 },
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
      "Yes! All paid plans come with a 14-day free trial. No credit card required.",
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
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]),
          }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [-100, 100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]),
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
        className="relative pt-40 pb-16 text-center px-6"
      >
        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10">
          ✦ PRICING
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto text-center">
          Choose the plan that works for your team. Start free, scale as you grow.
        </p>
      </motion.section>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-20">
        <span className={`text-sm font-medium ${billing === "monthly" ? "text-white" : "text-gray-400"}`}>
          Monthly
        </span>
        <button
          onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")}
          className="relative w-14 h-7 rounded-full bg-gray-800 border border-gray-700 transition-colors"
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-purple-500"
            animate={{ x: billing === "annual" ? 28 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
        <span className={`text-sm font-medium ${billing === "annual" ? "text-white" : "text-gray-400"}`}>
          Annual
        </span>
        <span className="ml-1 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
          Save 20%
        </span>
      </div>

      {/* Plan Cards */}
      <motion.section
        ref={plansRef}
        initial={{ opacity: 0, y: 30 }}
        animate={plansInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 pb-28"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isHovered = hoveredIndex === index;
            const priceDisplay =
              plan.priceLabel ??
              `$${billing === "monthly" ? plan.price.monthly : plan.price.annual}`;

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
                className="relative group pt-6"
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
                      className={`px-6 py-2.5 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold uppercase tracking-widest rounded-full`}
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
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className={`
                    relative h-full p-10 rounded-[2.5rem] overflow-hidden
                    ${plan.featured
                      ? "bg-white text-black"
                      : "bg-gray-900 border-2 border-gray-800"
                    }
                    shadow-xl hover:shadow-2xl transition-shadow duration-500
                  `}
                >
                  {/* Glassmorphic Accent */}
                  <motion.div
                    className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${plan.gradient} rounded-full blur-3xl`}
                    animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] } : { opacity: 0.1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />

                  {/* Floating Icon */}
                  <div className="relative mb-8">
                    <motion.div
                      animate={isHovered ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="relative z-10"
                    >
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-2xl ${
                        plan.featured
                          ? "bg-black/10 backdrop-blur-xl border-2 border-black/10"
                          : `bg-gradient-to-br ${plan.gradient}`
                      }`}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-2xl"
                        >
                          <div className={`absolute top-0 left-1/2 w-2 h-2 bg-gradient-to-r ${plan.gradient} rounded-full -translate-x-1/2`} />
                        </motion.div>
                        <Icon className={`w-10 h-10 relative z-10 ${plan.featured ? "text-black" : "text-white"}`} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Plan Name */}
                  <h3 className={`text-3xl font-bold mb-3 tracking-tight relative z-10 ${plan.featured ? "text-black" : "text-white"}`}>
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-base mb-10 font-light relative z-10 ${plan.featured ? "text-gray-600" : "text-gray-400"}`}>
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mb-10 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-7xl font-bold tracking-tighter ${plan.featured ? "text-black" : "text-white"}`}>
                        {priceDisplay}
                      </span>
                      {plan.period && (
                        <span className={`text-xl ${plan.featured ? "text-gray-500" : "text-gray-400"}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to={plan.ctaLink}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-full py-5 text-base font-semibold rounded-full mb-12 overflow-hidden text-center shadow-lg group/btn z-10 ${
                        plan.featured ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${plan.gradient}`}
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {plan.cta}
                        <motion.div
                          animate={isHovered ? { x: [0, 5, 0] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </span>
                    </motion.div>
                  </Link>

                  {/* Features */}
                  <div className="space-y-5 relative z-10">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={plansInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + featureIndex * 0.05 }}
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4 group/feature"
                      >
                        {feature.included ? (
                          <motion.div
                            whileHover={{ scale: 1.3, rotate: 360 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                              plan.featured ? "bg-green-500/20" : `bg-gradient-to-br ${plan.gradient}`
                            }`}
                          >
                            <Check className={`w-4 h-4 ${plan.featured ? "text-green-600" : "text-white"}`} strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gray-800">
                            <X className="w-4 h-4 text-gray-600" strokeWidth={3} />
                          </div>
                        )}
                        <span className={`text-base font-light ${
                          feature.included
                            ? plan.featured ? "text-gray-700" : "text-gray-300"
                            : "text-gray-600 line-through"
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
                        "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%, transparent 100%)",
                        "linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%, transparent 100%)",
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
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-white mb-16 tracking-tighter leading-[1.05]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
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
                <p className="px-6 pb-5 text-gray-400 leading-relaxed">
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
        className="relative text-center px-6 pb-32"
      >
        <p className="text-xl text-gray-400 mb-8 font-light">
          Need a custom plan for your organization?
        </p>
        <Link to="/contact">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-5 text-base font-semibold rounded-full border border-white/15 text-white hover:bg-white/5 hover:border-white/25 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              Contact Sales
              <ArrowRight className="w-5 h-5" />
            </span>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
}
