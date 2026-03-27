import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Check, Sparkles, Zap, FileText, Shield, BarChart2 } from 'lucide-react';

export function PayrollSection() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section ref={containerRef} className="relative py-20 md:py-32 lg:py-40 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden" style={{ position: 'relative' }}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y, rotate }}
          className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div ref={ref} className="relative max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
              >
                <Sparkles className="w-4 h-4" />
                Payroll Made Easy
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter"
              >
                Effortless
                <br />
                <span className="text-gray-700">Payroll</span>
              </motion.h2>
            
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg md:text-xl text-gray-400 mb-16 leading-relaxed font-light max-w-xl"
              >
                Automate your entire payroll workflow with intelligent calculations and instant reporting
              </motion.p>

              {/* Feature List */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Auto Calculations', icon: Zap },
                  { label: 'Digital Payslips', icon: FileText },
                  { label: 'Tax Compliance', icon: Shield },
                  { label: 'Reports & Analytics', icon: BarChart2 }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.6 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="group relative"
                  >
                    <motion.div
                    className="relative p-6 bg-gray-700 rounded-2xl border-2 border-gray-600 overflow-hidden cursor-pointer group shadow-lg shadow-purple-500/10"
                    initial="initial"
                    whileHover="hover"
                  >
                    {/* Dark Overlay Slide Effect */}
                    <motion.div
                      variants={{
                        initial: { y: "100%" },
                        hover: { y: "0%" }
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-black dark:bg-white z-0"
                    />

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <motion.div
                        variants={{
                          initial: { rotate: 0, scale: 1 },
                          hover: { rotate: 360, scale: 1.1 }
                        }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                      >
                        <item.icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </motion.div>
                      
                      <motion.div
                        variants={{
                          initial: { x: 0 },
                          hover: { x: 4 }
                        }}
                        className="flex items-center justify-between"
                      >
                        <motion.span 
                          className="text-base font-semibold"
                          variants={{
                            initial: { color: '#ffffff' },
                            hover: { color: '#ffffff' }
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.label}
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.4 }}
              className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-[3rem] p-12 border-2 border-gray-800 shadow-2xl hover:shadow-3xl transition-shadow duration-500 overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-[3rem]" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <motion.h3 
                      className="text-7xl lg:text-8xl font-bold text-white tracking-tighter mb-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      ₹24.5L
                    </motion.h3>
                  </motion.div>
                  <p className="text-gray-400 text-lg font-light">Total monthly payout · January 2025</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                  {[
                    { label: 'Employees', value: '248', color: 'from-purple-500 to-pink-500' },
                    { label: 'Processed', value: '100%', color: 'from-blue-500 to-cyan-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="relative p-8 bg-gray-900 rounded-2xl border-2 border-gray-800 hover:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Gradient accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                      
                      <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">{stat.label}</p>
                      <p className="text-5xl font-bold text-white tracking-tight">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Breakdown Bars */}
                <div className="space-y-8">
                  {[
                    { label: 'Base Salary', value: '₹18.2L', percent: 74, color: 'from-purple-500 to-pink-500' },
                    { label: 'Bonuses', value: '₹4.8L', percent: 20, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Deductions', value: '₹1.5L', percent: 6, color: 'from-orange-500 to-red-500' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 font-medium">{item.label}</span>
                        <span className="text-white font-bold text-lg">{item.value}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${item.percent}%` } : {}}
                          transition={{ 
                            duration: 1.5, 
                            delay: 1 + index * 0.2, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full relative overflow-hidden`}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            animate={{ x: ['0%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: -3 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.1, rotate: 0 }}
              className="absolute -bottom-8 -right-8 bg-gradient-to-br from-white to-gray-100 text-black rounded-3xl p-8 shadow-2xl shadow-white/20"
            >
              <p className="text-sm text-gray-600 mb-2 font-medium uppercase tracking-wider">Time Saved</p>
              <p className="text-6xl font-bold tracking-tight">15<span className="text-3xl text-gray-600">hrs</span></p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}