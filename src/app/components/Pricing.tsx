import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { Check, Sparkles, Rocket, Building2, ArrowRight } from 'lucide-react';

export function Pricing() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const plans = [
    {
      icon: Sparkles,
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 team members",
        "Basic time tracking",
        "Project management",
        "Mobile app access",
        "Email support",
        "Basic analytics"
      ],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      popular: false
    },
    {
      icon: Rocket,
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "For growing teams that need more power",
      features: [
        "Up to 50 team members",
        "Advanced time tracking",
        "Custom workflows",
        "Priority support",
        "Advanced analytics",
        "Integrations",
        "Custom branding",
        "API access"
      ],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      popular: true
    },
    {
      icon: Building2,
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited team members",
        "Enterprise security",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Advanced permissions",
        "Training & onboarding",
        "Custom contracts"
      ],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      popular: false
    }
  ];

  return (
    <section id="pricing" ref={containerRef} className="relative py-20 md:py-32 lg:py-40 bg-black overflow-hidden" style={{ position: 'relative' }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [100, -100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3])
          }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [-100, 100]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3])
          }}
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div ref={ref} className="relative max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center ">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10"
          >
            <Sparkles className="w-4 h-4" />
            Pricing Plans
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center"
          >
            Simple Pricing
            <br />
            <span className="text-gray-700">Big Value</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center"
          >
            Choose the perfect plan for your team. No hidden fees, cancel anytime.
          </motion.p>
        </div>

        {/* Pricing Cards - Redesigned */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.6 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group pt-6"
              >
                {/* Popular Badge - Outside the card */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1, type: 'spring' }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-30"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(168, 85, 247, 0.4)',
                          '0 0 40px rgba(236, 72, 153, 0.6)',
                          '0 0 20px rgba(168, 85, 247, 0.4)',
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                      className={`px-6 py-2.5 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold uppercase tracking-widest rounded-full`}
                    >
                      Most Popular
                    </motion.div>
                  </motion.div>
                )}

                {/* Animated Border Gradient */}
                <motion.div
                  className="absolute -inset-[2px] rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                  animate={isHovered ? {
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <div className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br ${plan.gradient} blur-sm`} />
                </motion.div>

                {/* Main Card */}
                <motion.div
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                  className={`
                    relative h-full p-10 rounded-[3rem] overflow-hidden
                    ${plan.popular 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800'
                    }
                    shadow-xl hover:shadow-2xl transition-shadow duration-500
                  `}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <motion.div
                      animate={isHovered ? {
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      } : {}}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 120, 120, 0.3) 0%, transparent 50%), 
                                         radial-gradient(circle at 80% 80%, rgba(120, 120, 120, 0.3) 0%, transparent 50%)`,
                        backgroundSize: '200% 200%'
                      }}
                    />
                  </div>

                  {/* Glassmorphic Accent */}
                  <motion.div
                    className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${plan.gradient} rounded-full blur-3xl`}
                    animate={isHovered ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.2, 0.1],
                    } : {
                      opacity: 0.1
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />

                  {/* Floating Icon with Particles */}
                  <div className="relative mb-8">
                    <motion.div
                      animate={isHovered ? {
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                      className="relative z-10"
                    >
                      <div className={`
                        w-20 h-20 rounded-2xl flex items-center justify-center relative
                        ${plan.popular 
                          ? 'bg-white/10 dark:bg-black/10 backdrop-blur-xl border-2 border-white/20 dark:border-black/20' 
                          : `bg-gradient-to-br ${plan.gradient}`
                        }
                        shadow-2xl
                      `}>
                        {/* Rotating Ring */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                          className="absolute inset-0 rounded-2xl"
                        >
                          <div className={`absolute top-0 left-1/2 w-2 h-2 bg-gradient-to-r ${plan.gradient} rounded-full -translate-x-1/2`} />
                        </motion.div>
                        
                        <Icon className={`w-10 h-10 relative z-10 ${plan.popular ? 'text-white dark:text-black' : 'text-white'}`} />
                      </div>
                    </motion.div>

                    {/* Particle Effects */}
                    {isHovered && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: [0, (Math.random() - 0.5) * 100],
                              y: [0, (Math.random() - 0.5) * 100],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className={`absolute top-10 left-10 w-2 h-2 rounded-full bg-gradient-to-r ${plan.gradient}`}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  {/* Plan Name with Gradient on Hover */}
                  <h3
                    className={`text-3xl font-bold mb-3 tracking-tight relative z-10 ${
                      plan.popular ? 'text-white dark:text-black' : 'text-black dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r'
                    } ${plan.gradient}`}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-base mb-10 font-light relative z-10 ${plan.popular ? 'text-gray-300 dark:text-gray-700' : 'text-gray-600 dark:text-gray-400'}`}>
                    {plan.description}
                  </p>

                  {/* Price with Animated Counter Effect */}
                  <div className="mb-10 relative z-10">
                    <motion.div
                      className="flex items-baseline gap-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        animate={isHovered ? {
                          textShadow: [
                            '0 0 0px rgba(0,0,0,0)',
                            `0 0 20px ${plan.popular ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                            '0 0 0px rgba(0,0,0,0)',
                          ]
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`text-7xl font-bold tracking-tighter ${plan.popular ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}
                      >
                        {plan.price}
                      </motion.span>
                      <span className={`text-xl ${plan.popular ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                        {plan.period}
                      </span>
                    </motion.div>
                  </div>

                  {/* CTA Button with Advanced Animations */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative w-full py-7 text-base font-semibold rounded-full mb-12 overflow-hidden
                      ${plan.popular
                        ? 'bg-white dark:bg-black text-black dark:text-white'
                        : 'bg-black dark:bg-white text-white dark:text-black'
                      }
                      shadow-lg group/btn z-10
                    `}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${plan.gradient}`}
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started
                      <motion.div
                        animate={isHovered ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </motion.button>

                  {/* Features with Stagger Animation */}
                  <div className="space-y-5 relative z-10">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: 0.8 + index * 0.1 + featureIndex * 0.05
                        }}
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4 group/feature"
                      >
                        <motion.div
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ duration: 0.5, type: 'spring' }}
                          className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center relative
                            ${plan.popular 
                              ? 'bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-black/20' 
                              : `bg-gradient-to-br ${plan.gradient}`
                            }
                          `}
                        >
                          {/* Ripple Effect on Hover */}
                          <motion.div
                            initial={{ scale: 1, opacity: 0 }}
                            whileHover={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`absolute inset-0 rounded-full border-2 ${plan.popular ? 'border-white/30 dark:border-black/30' : 'border-black/20 dark:border-white/20'}`}
                          />
                          <Check className={`w-4 h-4 relative z-10 ${plan.popular ? 'text-white dark:text-black' : 'text-white'}`} strokeWidth={3} />
                        </motion.div>
                        <span className={`text-base font-light group-/feature-hover:font-normal transition-all ${plan.popular ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300'}`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Shimmer Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={isHovered ? {
                      background: [
                        'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%, transparent 100%)',
                      ],
                      backgroundPosition: ['-200% 0', '200% 0'],
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-20"
        >
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-light">
            Need a custom plan for your organization?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button className="group relative px-12 py-7 text-base font-semibold rounded-full border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-black text-black dark:text-white overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
              <span className="relative z-10 flex items-center gap-3">
                <span className="flex overflow-hidden">
                  {"Contact Sales".split('').map((char, i) => (
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
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  <path
                    d="M4 10h12M12 6l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </span>
              {/* Gradient background on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}