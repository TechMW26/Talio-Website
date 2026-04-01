import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Clock, ArrowRight, Search, Tag, Calendar, User, ChevronRight } from 'lucide-react';
import { getPublishedBlogPosts, type BlogPost } from '@/lib/firebase';
import { usePageMeta } from '@/app/hooks/usePageMeta';

export function BlogPage() {
  usePageMeta('Blog', 'Insights, guides, and updates from the Talio team on productivity visibility, operational control, Mira, and connected HR workflows.');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try { setPosts(await getPublishedBlogPosts()); } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const allTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    posts.forEach(p => p.tags?.forEach(t => tagMap.set(t, (tagMap.get(t) || 0) + 1)));
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (selectedTag) result = result.filter(p => p.tags?.includes(selectedTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.metaDescription.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, search, selectedTag]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="absolute right-[10%] top-[10%] h-80 w-80 rounded-full bg-violet-600/8 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-10"
            >
              <Calendar className="w-4 h-4" />
              Talio Blog
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center"
            >
              Insights & Ideas
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center"
            >
              Deep dives into productivity visibility, operational control, Mira, product updates, and the future of work.
            </motion.p>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-5 text-base text-white placeholder-gray-500 backdrop-blur-xl transition focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>
          </motion.div>

          {/* Tags */}
          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-2"
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  !selectedTag
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 border border-white/10 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                All
              </button>
              {allTags.map(([tag]) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    selectedTag === tag
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-gray-400 border border-white/10 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-28 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
                <p className="text-sm text-gray-500">Loading articles...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="h-16 w-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
                <Tag className="h-7 w-7 text-gray-600" />
              </div>
              <p className="text-lg text-gray-400">No articles found</p>
              <p className="text-sm text-gray-600 mt-2">Try adjusting your search or selected tag.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="group block rounded-[32px] border border-white/10 bg-white/[0.02] overflow-hidden transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      {featured.featuredImage && (
                        <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                          <img
                            src={featured.featuredImage}
                            alt={featured.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className={`flex flex-col justify-center p-8 md:p-12 ${!featured.featuredImage ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-center gap-3 mb-5">
                          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                            Featured
                          </span>
                          {featured.tags?.[0] && (
                            <span className="text-xs text-gray-500">{featured.tags[0]}</span>
                          )}
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight group-hover:text-cyan-100 transition">
                          {featured.title}
                        </h2>
                        <p className="mt-4 text-gray-400 leading-relaxed line-clamp-3">
                          {featured.metaDescription}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {featured.authorName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(featured.publishedAt || featured.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {featured.readTimeMinutes && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {featured.readTimeMinutes} min read
                            </span>
                          )}
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:gap-3 transition-all">
                          Read article <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Rest of posts */}
              {rest.length > 0 && (
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col h-full rounded-[24px] border border-white/10 bg-white/[0.02] overflow-hidden transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        {post.featuredImage ? (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-600/10 flex items-center justify-center">
                            <Tag className="h-10 w-10 text-white/10" />
                          </div>
                        )}

                        <div className="flex flex-col flex-1 p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {post.tags?.slice(0, 2).map(t => (
                              <span key={t} className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[10px] text-gray-400">{t}</span>
                            ))}
                          </div>

                          <h3 className="text-lg font-semibold text-white leading-snug tracking-tight group-hover:text-cyan-100 transition line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                            {post.metaDescription}
                          </p>

                          <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-3">
                              <span>{post.authorName}</span>
                              <span>·</span>
                              <span>{new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                            {post.readTimeMinutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTimeMinutes} min
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-10 md:p-14"
          >
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Stay ahead of the curve</h2>
              <p className="mt-4 text-gray-400 max-w-lg">
                Get the latest insights on productivity visibility, Mira, operational control, and product updates delivered to your inbox.
              </p>
              <div className="mt-8">
                <Link
                  to="/get-started"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
                >
                Get Started <ChevronRight className="h-4 w-4" />
              </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
