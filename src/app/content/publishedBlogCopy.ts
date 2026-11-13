import type { BlogPost } from '@/lib/firebase';
import updatedBlogCopy from './updatedBlogCopy.json';

const originalSeedDate = '2026-03-31T09:02:54.750Z';

export function publishedBlogCopy(post: BlogPost): BlogPost {
  const replacement = updatedBlogCopy[post.slug as keyof typeof updatedBlogCopy];
  // The original seed is still served by Firebase. Prefer later editorial updates.
  if (!replacement || post.updatedAt !== originalSeedDate) return post;

  const wordCount = replacement.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  return { ...post, ...replacement, readTimeMinutes: Math.max(1, Math.round(wordCount / 200)) };
}
