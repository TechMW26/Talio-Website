import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function AIWorkflows() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  
  // Disappearing effect for heading
  const headingText = "AI Workflows";
  const [disappearingIndex, setDisappearingIndex] = useState(-1);
  
  useEffect(() => {
    const totalChars = headingText.length;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setDisappearingIndex(currentIndex);
      currentIndex = (currentIndex + 1) % (totalChars + 8); // +8 for pause between loops
      
      if (currentIndex >= totalChars) {
        setDisappearingIndex(-1); // Reset to show all chars during pause
      }
    }, 120);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-32 lg:py-40 bg-black dark:bg-white text-white dark:text-black relative overflow-hidden" style={{ position: 'relative' }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)
          `
        }} />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-28">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
          >
            <Sparkles className="w-4 h-4" />
            AI Workflows
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center"
          >
            Automate Everything
            <br />
            <span className="text-gray-600 dark:text-gray-400">With Intelligence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center"
          >
            From onboarding to performance reviews, let AI handle your workflows
          </motion.p>
        </div>

        {/* Stats - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-6 md:gap-12 mb-24 md:mb-32"
        >
          {[
            { value: '80%', label: 'Faster' },
            { value: '0', label: 'Errors' },
            { value: '24/7', label: 'Active' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="text-center group"
            >
              <div className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white dark:text-black mb-2 md:mb-3 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <p className="text-xs md:text-sm lg:text-base text-white dark:text-black font-light uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Workflow Templates - Clean Grid */}
        <div className="relative w-full overflow-hidden py-16 border-y border-white/10 dark:border-black/10 bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-3xl">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent dark:from-white dark:via-white/80 dark:to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent dark:from-white dark:via-white/80 dark:to-transparent z-10" />
          
          <motion.div
            animate={{ x: "-50%" }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex w-max"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                {[
                  { icon: '👥', title: 'Employee Onboarding', gradient: 'from-blue-400 to-cyan-400' },
                  { icon: '📝', title: 'Leave Approvals', gradient: 'from-purple-400 to-pink-400' },
                  { icon: '💰', title: 'Expense Reports', gradient: 'from-green-400 to-emerald-400' },
                  { icon: '⏰', title: 'Overtime Alerts', gradient: 'from-orange-400 to-red-400' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center mx-8 md:mx-12 group cursor-pointer">
                    <span className="text-4xl md:text-5xl mr-6 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className={`text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300 pb-2 leading-normal`}>
                      {item.title}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-white/30 dark:bg-black/30 ml-16 md:ml-24" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 md:mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-black/10 hover:border-white/20 dark:hover:border-black/20 transition-all duration-300 cursor-default group">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-emerald-400 transition-colors"></span>
            </span>
            <p className="text-gray-300 dark:text-gray-700 text-sm md:text-base lg:text-lg font-light tracking-wide">
              Customize workflows to match your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-medium">unique business processes</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}