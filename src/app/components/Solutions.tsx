import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { ArrowRight, Check } from "lucide-react";
import { solutions } from '@/app/content/solutionsData';

export function Solutions() {
  usePageMeta('Solutions', 'Explore how Talio fits modern teams that need productivity visibility, coordination, Mira, and HRMS add-ons in one operating system.');

  const heroRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-teal-400 uppercase tracking-widest mb-10">
            ✦ SOLUTIONS
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Built for Teams of All Sizes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
            Talio fits teams that need daily visibility, coordination, Mira, and HRMS add-ons in one practical operating utility.
          </p>
        </motion.div>
      </section>

      {/* Solution Blocks */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 space-y-8">
          {solutions.map((sol, i) => (
            <SolutionCard key={sol.title} solution={sol} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 text-center bg-gray-900 border border-gray-800 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 tracking-tighter leading-[1.05] text-center">
            Find the Right Solution for Your Team
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-12 text-center">
            Talk to our team and discover how Talio fits your operating model, team structure, and growth stage.
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full text-base hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function SolutionCard({
  solution,
  index,
}: {
  solution: (typeof solutions)[number];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-10"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Left */}
        <div className="flex-1">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-5`}
          >
            <solution.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{solution.title}</h3>
          <p className="text-gray-400 mb-6">{solution.desc}</p>
          <ul className="space-y-2.5">
            {solution.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Stats */}
        <div className="flex md:flex-col gap-6 md:gap-4 md:min-w-[160px]">
          {solution.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-800/50 border border-gray-800 rounded-2xl px-6 py-5 text-center"
            >
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${solution.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
