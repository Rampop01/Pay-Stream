'use client';

import dynamic from 'next/dynamic';
import { ContentCard } from '@/components/ContentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/useContent';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Search, Play, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
/** @description Content discovery and marketplace exploration page */


const Navbar = dynamic(() => import('@/components/Navbar').then((mod) => mod.Navbar), { ssr: false });

export type SortOption = 'recent' | 'price-low' | 'price-high' | 'popular';

export default function ExplorePage() {
  const { content, isLoading, error } = useContent();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [visibleItems, setVisibleItems] = useState(8);

  const loadMore = () => {
    setVisibleItems(prev => prev + 8);
  };

  // Get unique categories
  const categories = Array.from(
    new Set(content.map((c) => c.category).filter(Boolean))
  ) as string[];

  // Filter and Sort content
  const allFiltered = content
    .filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const isVisible = item.status !== 'hidden';
      return matchesSearch && matchesCategory && isVisible;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return b.createdAt - a.createdAt;
      if (sortBy === 'price-low') return a.priceInSTX - b.priceInSTX;
      if (sortBy === 'price-high') return b.priceInSTX - a.priceInSTX;
      if (sortBy === 'popular') return (b.totalUnlocks || 0) - (a.totalUnlocks || 0);
      return 0;
    });

  const filtered = allFiltered.slice(0, visibleItems);
  const hasMore = visibleItems < allFiltered.length;

  const categoryIcons: Record<string, string> = {
    'Education': '🎓',
    'Entertainment': '🎬',
    'Technology': '💻',
    'Art': '🎨',
    'Finance': '📈',
    'Music': '🎵',
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />

      <div className="orb orb-orange w-[400px] h-[400px] -top-32 -right-32 opacity-15" />
      <div className="orb orb-amber w-[300px] h-[300px] bottom-20 -left-24 opacity-10" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2"
        >
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-stacks-orange-light transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Discover <span className="gradient-text-stacks">Premium Content</span>
            </h1>
            <p className="text-white/40">
              Browse {content.length} decentralized creations on Stacks
            </p>
          </div>
          <Link href="/create">
            <button className="btn-stacks h-11 px-6 rounded-xl text-white text-sm font-bold flex items-center gap-2 hover-glow">
              <Sparkles className="w-4 h-4" />
              Start Earning
            </button>
          </Link>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow group">
              <div className="absolute inset-0 bg-stacks-orange/5 rounded-xl blur-lg group-focus-within:bg-stacks-orange/10 transition-all opacity-0 group-focus-within:opacity-100" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-stacks-orange transition-colors" />
              <input
                type="text"
                placeholder="Search premium videos, courses, music..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative w-full h-14 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-stacks-orange/40 focus:ring-0 text-base text-white placeholder:text-white/20 outline-none transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="text-white/40 text-xs">✕</span>
                </button>
              )}
            </div>
            
            <div className="relative min-w-[240px]">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full h-14 pl-12 pr-10 rounded-xl bg-white/5 border border-white/10 focus:border-stacks-orange/40 outline-none appearance-none text-sm font-bold text-white cursor-pointer transition-all hover:bg-white/[0.07]"
              >
                <option value="recent">Sort by: Newest First</option>
                <option value="popular">Sort by: Most Popular</option>
                <option value="price-low">Sort by: Price (Low to High)</option>
                <option value="price-high">Sort by: Price (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mr-2">Categories:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`h-9 px-5 rounded-full text-xs font-bold transition-all ${!selectedCategory
                  ? 'bg-stacks-orange text-white shadow-lg shadow-stacks-orange/30'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                }`}
            >
              Everything
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`h-9 px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${selectedCategory === cat
                    ? 'bg-stacks-orange text-white shadow-lg shadow-stacks-orange/30'
                    : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
              >
                <span>{categoryIcons[cat] || '📦'}</span>
                {cat}
              </button>
            ))}
            {(search || selectedCategory) && (
              <button 
                onClick={() => { setSearch(''); setSelectedCategory(null); }}
                className="text-[10px] font-black uppercase tracking-widest text-stacks-orange hover:text-stacks-orange-light transition-colors ml-2"
              >
                Clear All
              </button>
            )}
          </div>
        </motion.div>

        {/* Grid */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 glass-card rounded-xl border-red-500/20 mb-8"
          >
            <p className="font-semibold text-red-400 mb-1">
              Error loading content
            </p>
            <p className="text-sm text-white/40">{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-video skeleton-stacks rounded-xl" />
                <Skeleton className="h-4 w-3/4 skeleton-stacks rounded" />
                <Skeleton className="h-4 w-1/2 skeleton-stacks rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <ContentCard content={item} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-2xl"
          >
            <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-stacks-orange-light" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {search || selectedCategory
                ? 'No matching content'
                : 'No content found'}
            </h3>
            <p className="text-white/40 mb-6 max-w-md mx-auto">
              {search || selectedCategory
                ? 'Try a different search or category filter.'
                : 'Be the first creator on PayStream. Showcase your work and start earning STX.'}
            </p>
            {!search && !selectedCategory && (
              <Link href="/create">
                <button className="btn-stacks h-11 px-6 rounded-lg text-white font-semibold inline-flex items-center gap-2">
                  <span>Register Content</span>
                </button>
              </Link>
            )}
          </motion.div>
        )}

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={loadMore}
              className="px-8 py-3 rounded-xl glass border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
            >
              Load More Content
            </button>
          </div>
        )}
      </main>
    </div>
  );
}