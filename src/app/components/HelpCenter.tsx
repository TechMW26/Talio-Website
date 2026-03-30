import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { usePageMeta } from '@/app/hooks/usePageMeta';
import {
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";
import { categories, faqs, resources, type CategoryData } from '@/app/content/helpCenterData';

export function HelpCenter() {
  usePageMeta('Help Center', 'Find answers to common questions about Talio. Browse FAQs, guides, and resources to get the most out of your workforce management platform.');

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const heroRef = useRef(null);
  const catRef = useRef(null);
  const faqRef = useRef(null);
  const resRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const catInView = useInView(catRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const resInView = useInView(resRef, { once: true, margin: "-100px" });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-green-400 uppercase tracking-widest mb-10">
            ✦ HELP CENTER
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              How Can We Help You?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
            Find answers to common questions and learn how to get the most out of Talio.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section ref={catRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={catInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => { setSelectedCategory(cat); setExpandedArticle(null); }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-gray-700/80 transition-colors">
                <cat.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{cat.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{cat.desc}</p>
              <span className="inline-flex items-center gap-1 text-green-400 text-sm font-medium group-hover:gap-2 transition-all">
                View docs <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-16 tracking-tighter leading-[1.05]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-white pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Resources */}
      <section ref={resRef} className="pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={resInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 tracking-tighter leading-[1.05]">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {resources.map((res, i) => {
              const inner = (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <res.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{res.title}</h3>
                  <p className="text-gray-400 text-sm">{res.desc}</p>
                </div>
              );

              return res.link.startsWith("/") ? (
                <Link key={i} to={res.link}>
                  {inner}
                </Link>
              ) : (
                <a key={i} href={res.link}>
                  {inner}
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Documentation Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedCategory(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[85vh] bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-800/60 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <selectedCategory.icon className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{selectedCategory.title}</h2>
                  <p className="text-sm text-gray-500">{selectedCategory.desc}</p>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 px-8 py-6">
                <div className="space-y-3">
                  {selectedCategory.articles.map((article, idx) => {
                    const isExpanded = expandedArticle === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-gray-800/40 border border-gray-800/60 rounded-2xl overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedArticle(isExpanded ? null : idx)}
                          className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-800/60 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="font-medium text-white flex-1">{article.title}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pl-[4.25rem]">
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {article.content}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-gray-800/60 shrink-0">
                <p className="text-sm text-gray-500">
                  Still need help?{" "}
                  <Link
                    to="/contact"
                    className="text-green-400 hover:text-green-300 font-medium"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
