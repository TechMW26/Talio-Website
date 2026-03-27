import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { Lightbulb, Users, Shield, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedButton } from '@/app/components/AnimatedButton';
import { ZoomStorySection } from '@/app/components/ZoomStorySection';
import { usePageMeta } from '@/app/hooks/usePageMeta';

export function About() {
  usePageMeta('About', 'Learn about Talio\'s mission to revolutionize workforce management with AI. Meet the team behind the platform transforming how businesses manage their people.');

  const heroRef = useRef(null);
  const visionRef = useRef(null);
  const ventureRef = useRef(null);
  const valuesRef = useRef(null);
  const ctaRef = useRef(null);
  const cardsRef = useRef(null);
  const valuesCardsRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const visionInView = useInView(visionRef, { once: true, margin: "-100px" });
  const ventureInView = useInView(ventureRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Scroll progress for cards section
  const { scrollYProgress: cardsScrollProgress } = useScroll({
    target: cardsRef,
    offset: ["start end", "end start"]
  });

  // Scroll progress for values cards
  const { scrollYProgress: valuesScrollProgress } = useScroll({
    target: valuesCardsRef,
    offset: ["start start", "end end"]
  });

  // Scroll progress for venture section indicator
  const { scrollYProgress: ventureScrollProgress } = useScroll({
    target: ventureRef,
    offset: ["start end", "end start"]
  });

  // Values slider state
  const [activeValueIndex, setActiveValueIndex] = useState(0);

  const stats = [
    { value: '500+', label: 'Enterprise Signups' },
    { value: '50K+', label: 'Active Users' },
    { value: '15+', label: 'Years of Legacy' }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We continuously innovate to provide cutting-edge solutions that transform how teams work together.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'People Centric',
      description: 'Every feature we build starts with understanding and solving real challenges for working teams.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data security is our top priority. Enterprise-grade protection you can rely on.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Customer Success',
      description: 'We measure our success by yours. Dedicated support to help you achieve your goals.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="bg-gray-950 relative transition-colors duration-300" style={{ position: 'relative' }}>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center py-20 md:py-32 overflow-hidden" style={{ position: 'relative' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" />
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 text-center z-10 flex flex-col items-center">
          {/* About Us Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-blue-400 uppercase tracking-widest">
              ✦ ABOUT US
            </span>
          </motion.div>

          {/* Main Heading - Simple without effects */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center"
          >
            <span className="text-white">Building the Future </span>
            <span className="text-white">of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Workforce</span>
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Management</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-2xl text-center"
          >
            A merger of Mushroom World Umbrella, dedicated to transforming how teams work together.
          </motion.p>
        </div>
      </section>

      {/* Zoom Story Section - Replaces Vision Section */}
      <ZoomStorySection />

      {/* Venture Section */}
      <section ref={ventureRef} className="relative bg-gray-950 py-20 md:py-24 overflow-hidden transition-colors duration-300" style={{ position: 'relative' }}>
        {/* Scroll Progress Indicator */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 origin-left z-50"
          style={{
            scaleX: useTransform(
              ventureScrollProgress,
              [0, 1],
              [0, 1]
            )
          }}
        />

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 right-[10%] w-32 h-32 border border-blue-800/30 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 left-[15%] w-24 h-24 border border-purple-800/30"
            style={{ transform: 'rotate(45deg)' }}
          />
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-[5%] w-16 h-16 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-full blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Large Typography Section with Scroll Effects */}
          <div className="mb-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={ventureInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Main Heading with Kinetic Typography */}
              <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight mb-20">
                <motion.span 
                  initial={{ opacity: 0, y: 40 }}
                  animate={ventureInView ? { opacity: 0.1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="block text-white mb-3"
                >
                  A Venture
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 40 }}
                  animate={ventureInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block text-white mb-3"
                >
                  of{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                    Mushroom
                  </span>
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 40 }}
                  animate={ventureInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 mb-12"
                >
                  World Umbrella
                </motion.span>
              </h2>

              {/* Description with Clean Layout */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl">
                {/* Left Column - Main Description */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={ventureInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pt-2"
                >
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={ventureInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.9 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          01
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                          Core Mission
                        </span>
                      </div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={ventureInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 1, delay: 1.1 }}
                      className="text-xl md:text-2xl text-white leading-relaxed font-normal"
                    >
                      Mushroom World Umbrella is the modern catalyst and innovation arm of Mushroom World Holding.
                    </motion.p>
                  </div>
                </motion.div>

                {/* Right Column - Supporting Description */}
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={ventureInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pt-2"
                >
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={ventureInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 1.1 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                          02
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                          Our Approach
                        </span>
                      </div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={ventureInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 1, delay: 1.3 }}
                      className="text-base md:text-lg text-gray-400 leading-relaxed font-light"
                    >
                      We are the transformation in introducing new solutions and adding industry-grade software, with innovations designed in partnership with world-class creative pioneers.
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Asymmetric Grid Layout for Cards */}
          <div ref={cardsRef} className="relative" style={{ position: 'relative' }}>
            {/* Grid Background Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-800" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-800" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-800" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-800" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-800" />
            </div>

            {/* Cards with Creative Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 relative">
              {[
                { 
                  icon: '01', 
                  title: 'Unified Flexibility', 
                  desc: 'Complete ecosystem for all industries',
                  span: 'lg:col-span-6',
                  gradient: 'from-blue-600 to-cyan-600'
                },
                { 
                  icon: '02', 
                  title: 'Making Ideas Work', 
                  desc: 'Turn ambitions into executable actions',
                  span: 'lg:col-span-6',
                  gradient: 'from-purple-600 to-pink-600'
                },
                { 
                  icon: '03', 
                  title: 'Real Innovation', 
                  desc: 'Cutting-edge AI and data analytics',
                  span: 'lg:col-span-7',
                  gradient: 'from-violet-600 to-indigo-600'
                },
                { 
                  icon: '04', 
                  title: 'Strategic Execution', 
                  desc: 'Long-term excellence with data insights',
                  span: 'lg:col-span-5',
                  gradient: 'from-orange-600 to-red-600'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 1, 
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  className={`${item.span} group relative cursor-pointer`}
                >
                  {/* Card Container */}
                  <div className="relative h-full min-h-[320px] md:min-h-[380px] p-8 md:p-10 lg:p-12 overflow-hidden border-r border-b border-gray-800">
                    {/* Hover Background Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}
                    />

                    {/* Animated Corner Accent */}
                    <div
                      className="absolute top-0 left-0 border-t-2 border-l-2 border-white w-0 h-0 group-hover:w-[60px] group-hover:h-[60px] transition-all duration-400"
                    />

                    {/* Number Badge */}
                    <div
                      className="absolute top-8 right-8"
                    >
                      <span className={`text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-100 transition-opacity duration-500`}>
                        {item.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between z-10">
                      <div className="space-y-6 pr-20">
                        {/* Minimal Icon Line */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: 40 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`h-0.5 bg-gradient-to-r ${item.gradient}`}
                        />

                        {/* Title */}
                        <h4 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
                          {item.title}
                        </h4>

                        {/* Description */}
                        <p className="text-base md:text-lg text-gray-400 group-hover:text-white leading-relaxed font-light max-w-xs transition-colors duration-300">
                          {item.desc}
                        </p>
                      </div>

                      {/* Hover Arrow - visible on group hover */}
                      <div
                        className="flex items-center gap-2 text-sm font-medium text-white opacity-0 -translate-x-2.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Line Accent */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
            className="mt-32 pt-16 border-t border-gray-800"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: '15+', label: 'Years Legacy' },
                { value: '500+', label: 'Enterprise Clients' },
                { value: '50K+', label: 'Active Users' },
                { value: '99.9%', label: 'Uptime SLA' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tighter"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm md:text-base text-gray-400 font-light tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section - Horizontal Scroll */}
      <section ref={valuesCardsRef} className="relative h-[300vh] bg-gray-950" style={{ position: 'relative' }}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          
          {/* Section Header */}
          <div className="absolute top-32 left-0 right-0 text-center z-20 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-widest">
                💫 THE WAY WE WORK
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tighter text-white"
            >
              What Drives{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Us Forward
              </span>
            </motion.h2>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="w-full relative z-10 mt-24">
            <motion.div 
              className="flex gap-6 px-6"
              style={{ 
                x: useTransform(valuesScrollProgress, [0, 1], ["1%", "-60%"])
              }}
            >
              {values.map((value, index) => {
                const Icon = value.icon;
                
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[50vw] xl:w-[40vw]"
                  >
                    <div className="relative w-full h-[500px] md:h-[550px] rounded-[2rem] overflow-hidden group shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
                      {/* Full Image Background */}
                      <img 
                        src={[
                          "https://images.unsplash.com/photo-1750365919878-2735d30fa3d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5vdmF0aW9uJTIwbGlnaHRidWxiJTIwdGVjaG5vbG9neSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzY5ODQzNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
                          "https://images.unsplash.com/photo-1758691737138-7b9b1884b1db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwb2ZmaWNlJTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjB3b3JraW5nJTIgdG9nZXRoZXIlMjBoYXBweXxlbnwxfHx8fDE3Njk4NDM3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                          "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlciUyMHNlY3VyaXR5JTIwZGlnaXRhbCUyMGRhdGElMjBwcm90ZWN0aW9uJTIwc2hpZWxkfGVufDF8fHx8MTc2OTg0MzcwMnww&ixlib=rb-4.1.0&q=80&w=1080",
                          "https://images.unsplash.com/photo-1744854185466-cf95c3064cec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN1Y2Nlc3MlMjBncm93dGglMjBwcm9maXQlMjBjaGFydCUyMHVwd2FyZHxlbnwxfHx8fDE3Njk4NDM3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        ][index]} 
                        alt={value.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      
                      {/* Glass Overlay with Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 backdrop-blur-[2px]" />
                      
                      {/* Glass Effect Border */}
                      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />

                      {/* Content Section */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10">
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                            {value.title}
                          </h3>
                          
                          <p className="text-base md:text-lg text-white/90 leading-relaxed font-light mb-6 max-w-xl">
                            {value.description}
                          </p>

                          <div className="flex items-center gap-2 text-white font-semibold text-sm group/btn cursor-pointer">
                            <span className="border-b border-transparent group-hover/btn:border-white transition-colors duration-300">
                              Learn more
                            </span>
                            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300 backdrop-blur-sm">
                               <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                            </div>
                          </div>
                      </div>

                      {/* Bottom Glass Shine */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-400 text-sm">
            <span>Scroll to explore</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-sales" ref={ctaRef} className="py-32 md:py-48 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden" style={{ position: 'relative' }}>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 md:px-8 lg:px-16 text-center z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tighter"
          >
            Ready to Transform Your Workforce?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mb-12 max-w-3xl mx-auto"
          >
            Join hundreds of companies already using Talio to drive smarter decisions and better results.
          </motion.p>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Email Input */}
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm rounded-2xl text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-white focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"
                  />
                </div>

                {/* Mobile Input */}
                <div className="relative group">
                  <input
                    type="tel"
                    placeholder="Enter your mobile"
                    className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm rounded-2xl text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-white focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <AnimatedButton label="Get Started Free" size="lg" fullWidth />

              {/* Trust Badge */}
              <p className="text-white/70 text-sm mt-4">
                ✓ No credit card required • ✓ Free 14-day trial • ✓ Cancel anytime
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <AnimatedButton label="Contact Sales Team" variant="secondary" size="lg" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}