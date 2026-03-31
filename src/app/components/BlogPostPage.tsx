import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft, Calendar, Clock, User, Tag, ChevronRight,
  Share2, Copy, Check, ArrowRight,
} from 'lucide-react';
import { getBlogPostBySlug, getPublishedBlogPosts, type BlogPost } from '@/lib/firebase';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      try {
        const found = await getBlogPostBySlug(slug);
        setPost(found);
        if (found) {
          const all = await getPublishedBlogPosts();
          const others = all
            .filter(p => p.slug !== found.slug)
            .filter(p => p.tags?.some(t => found.tags?.includes(t)))
            .slice(0, 3);
          setRelated(others.length ? others : all.filter(p => p.slug !== found.slug).slice(0, 3));
        }
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, [slug]);

  // Dynamic meta tags and SEO structured data
  useEffect(() => {
    if (!post) return;

    const base = 'Talio';
    document.title = `${post.title} — ${base} Blog`;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', post.metaDescription);
    setMeta('og:title', `${post.title} — ${base} Blog`, 'property');
    setMeta('og:description', post.metaDescription, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', window.location.href, 'property');
    if (post.featuredImage) setMeta('og:image', post.featuredImage, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', post.title);
    setMeta('twitter:description', post.metaDescription);
    if (post.featuredImage) setMeta('twitter:image', post.featuredImage);
    setMeta('article:published_time', post.publishedAt || post.createdAt, 'property');
    setMeta('article:author', post.authorName, 'property');

    // JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      image: post.featuredImage || undefined,
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      author: { '@type': 'Person', name: post.authorName },
      publisher: {
        '@type': 'Organization',
        name: 'Talio',
        url: window.location.origin,
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': window.location.href },
      wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length,
      articleBody: post.content.replace(/<[^>]*>/g, '').slice(0, 500),
    };

    let scriptEl = document.getElementById('blog-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'blog-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    // Breadcrumb structured data
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${window.location.origin}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: window.location.href },
      ],
    };

    let breadcrumbEl = document.getElementById('blog-breadcrumb-jsonld') as HTMLScriptElement | null;
    if (!breadcrumbEl) {
      breadcrumbEl = document.createElement('script');
      breadcrumbEl.id = 'blog-breadcrumb-jsonld';
      breadcrumbEl.type = 'application/ld+json';
      document.head.appendChild(breadcrumbEl);
    }
    breadcrumbEl.textContent = JSON.stringify(breadcrumbLd);

    return () => {
      document.getElementById('blog-jsonld')?.remove();
      document.getElementById('blog-breadcrumb-jsonld')?.remove();
    };
  }, [post]);

  const publishedDate = useMemo(() => {
    if (!post) return '';
    return new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }, [post]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          <p className="text-sm text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <div className="h-20 w-20 rounded-full bg-white/[0.04] flex items-center justify-center mb-6">
          <Tag className="h-9 w-9 text-gray-600" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Article Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-6 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero / Header */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[15%] h-96 w-96 rounded-full bg-cyan-500/6 blur-[140px]" />
          <div className="absolute right-[10%] top-[25%] h-72 w-72 rounded-full bg-violet-600/6 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 md:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-10"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/blog" className="hover:text-gray-300 transition">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-400 truncate max-w-[200px]">{post.title}</span>
          </motion.nav>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20 transition"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
          >
            {post.title}
          </motion.h1>

          {/* Meta description as lead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-3xl"
          >
            {post.metaDescription}
          </motion.p>

          {/* Author & meta bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300">{post.authorName}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {publishedDate}
            </span>

            {post.readTimeMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTimeMinutes} min read
              </span>
            )}

            <button
              onClick={handleCopyLink}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-gray-400 hover:text-white hover:border-white/20 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto px-6 md:px-8 mb-16"
        >
          <div className="rounded-[24px] overflow-hidden border border-white/10">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full object-cover max-h-[520px]"
            />
          </div>
        </motion.div>
      )}

      {/* Article Body */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-4xl mx-auto px-6 md:px-8 pb-20"
      >
        <div
          className="blog-content prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-blockquote:border-l-cyan-500/50 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-2xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-gray-300
            prose-code:text-cyan-300 prose-code:bg-white/[0.06] prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
            prose-img:rounded-2xl prose-img:border prose-img:border-white/10
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-cyan-500/50"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>

      {/* Share & Back */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 hover:text-white hover:border-white/20 transition"
              aria-label="Share on Twitter"
            >
              <Share2 className="h-4 w-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 hover:text-white hover:border-white/20 transition"
              aria-label="Share on LinkedIn"
            >
              <Share2 className="h-4 w-4" />
            </a>
            <button
              onClick={handleCopyLink}
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 hover:text-white hover:border-white/20 transition"
              aria-label="Copy link"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="relative py-20 md:py-28 overflow-hidden border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex flex-col items-center text-center px-6 mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center"
              >
                Related Articles
              </motion.h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((rp, i) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <Link
                    to={`/blog/${rp.slug}`}
                    className="group flex flex-col h-full rounded-[24px] border border-white/10 bg-white/[0.02] overflow-hidden transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    {rp.featuredImage ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={rp.featuredImage}
                          alt={rp.title}
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
                        {rp.tags?.slice(0, 2).map(t => (
                          <span key={t} className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[10px] text-gray-400">{t}</span>
                        ))}
                      </div>

                      <h3 className="text-lg font-semibold text-white leading-snug tracking-tight group-hover:text-cyan-100 transition line-clamp-2">
                        {rp.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                        {rp.metaDescription}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                        <span>{new Date(rp.publishedAt || rp.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        {rp.readTimeMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rp.readTimeMinutes} min
                          </span>
                        )}
                      </div>

                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 group-hover:gap-2.5 transition-all">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
