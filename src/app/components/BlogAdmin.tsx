import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Plus, Pencil, Trash2, Eye, Search, ArrowLeft, Save, Send, X,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, List, ListOrdered,
  Quote, ImageIcon, LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3, Undo, Redo, UserPlus, Users, FileText,
  Clock, Tag, Globe, Upload,
} from 'lucide-react';
import {
  createBlogPost, updateBlogPost, deleteBlogPost, getBlogPosts,
  addBlogEditor, removeBlogEditor, getBlogEditors,
  type BlogPost, type BlogEditor,
} from '@/lib/firebase';

const panelClassName =
  'rounded-[28px] border border-white/10 bg-[#0b1323]/80 shadow-[0_24px_80px_rgba(2,8,23,0.55)] backdrop-blur-xl';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '');
}

// ── Rich Text Toolbar ──

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt('Link URL:');
    if (url) editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
  };

  const btn = (active: boolean, onClick: () => void, Icon: typeof Bold, title: string) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-2 transition ${active ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-white/[0.02] px-3 py-2 rounded-t-2xl">
      {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), Bold, 'Bold')}
      {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), Italic, 'Italic')}
      {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), UnderlineIcon, 'Underline')}
      {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), Strikethrough, 'Strikethrough')}
      {btn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), Code, 'Inline Code')}
      <div className="mx-1 h-5 w-px bg-white/10" />
      {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), Heading1, 'Heading 1')}
      {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, 'Heading 2')}
      {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3, 'Heading 3')}
      <div className="mx-1 h-5 w-px bg-white/10" />
      {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), List, 'Bullet List')}
      {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, 'Ordered List')}
      {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), Quote, 'Blockquote')}
      <div className="mx-1 h-5 w-px bg-white/10" />
      {btn(editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), AlignLeft, 'Align Left')}
      {btn(editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), AlignCenter, 'Align Center')}
      {btn(editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), AlignRight, 'Align Right')}
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button type="button" onClick={addImage} title="Insert Image" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition">
        <ImageIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={addLink} title="Insert Link" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition">
        <LinkIcon className="h-4 w-4" />
      </button>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} title="Undo" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition">
        <Undo className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} title="Redo" className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white transition">
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Blog Post Editor ──

function PostEditor({
  post,
  authorEmail,
  authorName,
  onSave,
  onCancel,
}: {
  post: BlogPost | null;
  authorEmail: string;
  authorName: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!post);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressAndConvert = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const maxWidth = 1200;
      const quality = 0.8;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/webp', quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const dataUrl = await compressAndConvert(file);
      setFeaturedImage(dataUrl);
    } catch { /* silent */ }
    setUploading(false);
  }, [compressAndConvert]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }, [handleImageUpload]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Start writing your blog post...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none px-5 py-4 min-h-[400px] focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (autoSlug && title) setSlug(generateSlug(title));
  }, [title, autoSlug]);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim() || !editor) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const data: Omit<BlogPost, 'id'> = {
        title: title.trim(),
        slug: slug || generateSlug(title),
        metaDescription: metaDescription.trim(),
        content: editor.getHTML(),
        featuredImage: featuredImage.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        authorEmail,
        authorName,
        createdAt: post?.createdAt || now,
        updatedAt: now,
        ...(status === 'published' && !post?.publishedAt ? { publishedAt: now } : {}),
        ...(post?.publishedAt ? { publishedAt: post.publishedAt } : {}),
      };

      if (post?.id) {
        await updateBlogPost(post.id, data);
      } else {
        await createBlogPost(data);
      }
      onSave();
    } catch (err) {
      alert(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const seoScore = useMemo(() => {
    let score = 0;
    if (title.length >= 30 && title.length <= 60) score += 25;
    else if (title.length > 0) score += 10;
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 25;
    else if (metaDescription.length > 0) score += 10;
    if (featuredImage) score += 25;
    if (slug && !slug.includes(' ')) score += 25;
    return score;
  }, [title, metaDescription, featuredImage, slug]);

  const seoColor = seoScore >= 75 ? 'text-emerald-400' : seoScore >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </button>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${seoColor}`}>SEO: {seoScore}/100</span>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving || !title.trim()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving || !title.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Main editor */}
        <div className="space-y-5">
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-600 focus:outline-none tracking-tight"
            />
          </div>

          <div className={`${panelClassName} overflow-hidden`}>
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar meta */}
        <div className="space-y-5">
          <div className={`${panelClassName} p-5 space-y-4`}>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" /> SEO Settings
            </h3>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">URL Slug</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none"
                  placeholder="url-slug"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-600">/blog/{slug || 'your-slug'}</p>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                rows={3}
                maxLength={160}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none resize-none"
                placeholder="Concise description for search engines (120-160 chars)"
              />
              <p className={`mt-1 text-[10px] ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-emerald-500' : 'text-slate-600'}`}>
                {metaDescription.length}/160 characters
              </p>
            </div>
          </div>

          <div className={`${panelClassName} p-5 space-y-4`}>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-violet-400" /> Featured Image
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }}
            />
            {featuredImage ? (
              <div className="relative group">
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                  <img src={featuredImage} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/30 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] py-8 cursor-pointer hover:border-cyan-500/30 hover:bg-white/[0.04] transition"
              >
                {uploading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
                ) : (
                  <Upload className="h-6 w-6 text-slate-500" />
                )}
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-300">Click to upload or drag & drop</p>
                  <p className="text-[10px] text-slate-600 mt-1">PNG, JPG, WebP — max 1200px wide</p>
                </div>
              </div>
            )}
          </div>

          <div className={`${panelClassName} p-5 space-y-4`}>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-400" /> Tags
            </h3>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none"
              placeholder="tag1, tag2, tag3"
            />
            {tags && (
              <div className="flex flex-wrap gap-1.5">
                {tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[11px] text-slate-300">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Editor Management ──

function EditorManagement() {
  const [editors, setEditors] = useState<BlogEditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchEditors = useCallback(async () => {
    setLoading(true);
    try { setEditors(await getBlogEditors()); } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchEditors(); }, [fetchEditors]);

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setAdding(true);
    try {
      await addBlogEditor({ email: newEmail.trim().toLowerCase(), name: newName.trim(), createdAt: new Date().toISOString() });
      setNewName('');
      setNewEmail('');
      await fetchEditors();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add editor');
    }
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this editor?')) return;
    await removeBlogEditor(id);
    await fetchEditors();
  };

  return (
    <div className={`${panelClassName} p-6 space-y-6`}>
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-white">Blog Editors</h3>
        <span className="ml-auto text-xs text-slate-500">{editors.length} editor{editors.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Editor name"
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none"
        />
        <input
          type="email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          placeholder="Editor email"
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newName.trim() || !newEmail.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-500/15 border border-violet-500/30 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/25 disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          Add
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
        </div>
      ) : editors.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No editors added yet. Add one above to get started.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {editors.map(ed => (
            <div key={ed.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-white">{ed.name}</p>
                <p className="text-xs text-slate-500">{ed.email}</p>
              </div>
              <button
                onClick={() => ed.id && handleRemove(ed.id)}
                className="rounded-lg p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Blog Admin ──

export function BlogAdmin({ authorEmail, authorName }: { authorEmail: string; authorName: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null | 'new'>(null);
  const [showEditorMgmt, setShowEditorMgmt] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try { setPosts(await getBlogPosts()); } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q)) ||
      p.authorName.toLowerCase().includes(q)
    );
  }, [posts, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this post?')) return;
    setDeleting(id);
    try {
      await deleteBlogPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch { /* silent */ }
    setDeleting(null);
  };

  // Editor view
  if (editingPost) {
    return (
      <PostEditor
        post={editingPost === 'new' ? null : editingPost}
        authorEmail={authorEmail}
        authorName={authorName}
        onSave={() => { setEditingPost(null); fetchPosts(); }}
        onCancel={() => setEditingPost(null)}
      />
    );
  }

  const draftCount = posts.filter(p => p.status === 'draft').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${panelClassName} p-5`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10">
            <FileText className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{posts.length}</p>
          <p className="mt-1 text-xs text-slate-500">Total Posts</p>
        </div>
        <div className={`${panelClassName} p-5`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Globe className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{publishedCount}</p>
          <p className="mt-1 text-xs text-slate-500">Published</p>
        </div>
        <div className={`${panelClassName} p-5`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10">
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{draftCount}</p>
          <p className="mt-1 text-xs text-slate-500">Drafts</p>
        </div>
        <div className={`${panelClassName} p-5`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10">
            <Users className="h-5 w-5 text-violet-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">—</p>
          <p className="mt-1 text-xs text-slate-500">Editors</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts by title, tag, or author..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-cyan-400/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditorMgmt(!showEditorMgmt)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            <Users className="h-4 w-4" />
            Manage Editors
          </button>
          <button
            onClick={() => setEditingPost('new')}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Editor management */}
      <AnimatePresence>
        {showEditorMgmt && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <EditorManagement />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts list */}
      <div className={`${panelClassName} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Blog Posts</h3>
          </div>
          <span className="text-xs text-slate-500">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">No blog posts yet</p>
            <p className="text-xs text-slate-600 mt-1">Click "New Post" to create your first article.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredPosts.map(post => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition group">
                {post.featuredImage ? (
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <img src={post.featuredImage} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-14 w-20 shrink-0 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-slate-600" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">{post.title}</h4>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      post.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>{post.authorName}</span>
                    <span>·</span>
                    <span>{new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {post.readTimeMinutes && (
                      <>
                        <span>·</span>
                        <span>{post.readTimeMinutes} min read</span>
                      </>
                    )}
                    {post.tags?.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="truncate max-w-[150px]">{post.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  {post.status === 'published' && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setEditingPost(post)}
                    className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => post.id && handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="rounded-lg p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
