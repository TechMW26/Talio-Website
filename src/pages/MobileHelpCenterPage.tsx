import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { categories, faqs, resources } from '@/app/content/helpCenterData';

export function MobileHelpCenterPage() {
  usePageMeta('Help Center', 'Find answers to common questions about Talio. Browse FAQs, guides, and resources to get the most out of your workforce management platform.');

  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="relative overflow-hidden pt-28 pb-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
              ✦ Help center
            </span>
            <h1 className="mt-8 text-[clamp(2.7rem,10vw,4.6rem)] font-bold tracking-tighter leading-[0.98]">
              How can we
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                help you today?
              </span>
            </h1>
            <p className="mt-8 max-w-md text-base font-light leading-relaxed text-gray-400">
              Find documentation, FAQs, and support resources to get the most out of Talio.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Guides</span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">Browse by category</h2>
          </div>

          <div className="mt-12 space-y-4">
            {categories.map((category, categoryIndex) => {
              const isCategoryOpen = openCategory === categoryIndex;

              return (
                <div key={category.title} className="overflow-hidden rounded-[2rem] border border-white/10 bg-gray-900/60">
                  <button
                    type="button"
                    onClick={() => setOpenCategory(isCategoryOpen ? null : categoryIndex)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <category.icon className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <span className="block text-base font-semibold text-white">{category.title}</span>
                        <span className="mt-1 block text-sm text-gray-400">{category.desc}</span>
                      </div>
                    </div>
                    <motion.span animate={{ rotate: isCategoryOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </motion.span>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isCategoryOpen ? 'auto' : 0, opacity: isCategoryOpen ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 px-5 pb-5">
                      {category.articles.map((article, articleIndex) => {
                        const articleKey = `${categoryIndex}-${articleIndex}`;
                        const isArticleOpen = openArticle === articleKey;

                        return (
                          <div key={article.title} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                            <button
                              type="button"
                              onClick={() => setOpenArticle(isArticleOpen ? null : articleKey)}
                              className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
                            >
                              <span className="text-sm font-medium text-white">{article.title}</span>
                              <motion.span animate={{ rotate: isArticleOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              </motion.span>
                            </button>
                            <motion.div
                              initial={false}
                              animate={{ height: isArticleOpen ? 'auto' : 0, opacity: isArticleOpen ? 1 : 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <span className="block px-4 pb-4 text-sm leading-relaxed text-gray-400">{article.content}</span>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">FAQ</span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">Frequently asked questions</h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.q} className="overflow-hidden rounded-[2rem] border border-white/10 bg-gray-900/60">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="text-sm font-medium text-white">{faq.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <span className="block px-5 pb-5 text-sm leading-relaxed text-gray-400">{faq.a}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Resources</span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">More ways to get support</h2>
          </div>

          <div className="mt-12 grid gap-4">
            {resources.map((resource, index) => {
              const inner = (
                <div className="rounded-[2rem] border border-white/10 bg-gray-900/60 p-5 transition hover:border-white/15">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <resource.icon className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="mt-5 block text-xl font-semibold text-white">{resource.title}</span>
                  <span className="mt-2 block text-sm text-gray-400">{resource.desc}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-400">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              );

              return resource.link.startsWith('/') ? (
                <Link key={resource.title} to={resource.link}>
                  {inner}
                </Link>
              ) : (
                <a key={resource.title} href={resource.link} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}