'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Content } from '@/lib/types';
import { 
  Library, 
  Clock, 
  ExternalLink, 
  Play, 
  Download,
  Loader2,
  Calendar,
  Zap,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface UnlockedContent extends Content {
  purchasedAt: number;
  txId: string;
}

export default function ProfilePage() {
  const { address } = useWalletStore();
  const [library, setLibrary] = useState<UnlockedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchLibrary();
    }
  }, [address]);

  const fetchLibrary = async () => {
    try {
      const res = await fetch(`/api/profile/unlocks?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setLibrary(data);
      }
    } catch (error) {
      console.error('Failed to fetch library:', error);
      toast.error('Could not load your library');
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="glass p-12 rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <Library className="w-16 h-16 text-stacks-orange mx-auto mb-6 opacity-20" />
            <h1 className="text-3xl font-bold mb-4">Your Content Library</h1>
            <p className="text-white/60 mb-8 text-lg">Connect your wallet to access all the premium content you've unlocked on ContentStream.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-stacks-orange/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-stacks-orange/20 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-stacks-orange" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">My Library</h1>
          </div>
          <p className="text-white/50 text-lg">All your unlocked premium content in one place</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/40">
            <Loader2 className="w-10 h-10 animate-spin text-stacks-orange" />
            <p className="font-medium">Syncing your library from the blockchain...</p>
          </div>
        ) : library.length === 0 ? (
          <div className="py-32 text-center glass rounded-3xl border border-white/10 max-w-3xl mx-auto px-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mx-auto mb-6">
              <Zap className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Your library is empty</h3>
            <p className="text-white/40 mb-8 max-w-md mx-auto">You haven't unlocked any content yet. Explore the marketplace to find exclusive videos, art, and educational materials.</p>
            <Link href="/explore">
              <button className="btn-stacks px-8 py-3 rounded-xl font-bold">
                Start Exploring
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {library.map((item) => (
              <LibraryCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LibraryCard({ content }: { content: UnlockedContent }) {
  return (
    <div className="glass group rounded-2xl border border-white/10 overflow-hidden hover:border-stacks-orange/50 transition-all duration-500 hover:shadow-2xl hover:shadow-stacks-orange/10 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={content.thumbnailUrl} 
          alt={content.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/80">
          {content.category}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/content/${content.id}`}>
            <div className="w-14 h-14 rounded-full bg-stacks-orange text-white flex items-center justify-center shadow-xl shadow-stacks-orange/40 scale-75 group-hover:scale-100 transition-transform duration-500">
              <Play className="w-6 h-6 fill-current" />
            </div>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-stacks-orange transition-colors line-clamp-1">
            {content.title}
          </h3>
          <Link href={`/content/${content.id}`} className="text-white/40 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
        
        <p className="text-white/40 text-sm mb-6 line-clamp-2 flex-grow">
          {content.description}
        </p>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-white/30 italic">
              <Calendar className="w-3 h-3" />
              Unlocked on {new Date(content.purchasedAt).toLocaleDateString()}
            </div>
            <div className="text-stacks-orange-light font-bold">
              OWNED
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-white/20 font-mono overflow-hidden">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">TX: {content.txId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
