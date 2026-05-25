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
  Bookmark,
  Settings,
  X,
  Check,
  User
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
/** @description User library and unlocked content view */


interface UnlockedContent extends Content {
  purchasedAt: number;
  txId: string;
}

interface UserProfile {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

export default function ProfilePage() {
  const { address } = useWalletStore();
  const [library, setLibrary] = useState<UnlockedContent[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'library' | 'history' | 'settings' | 'portfolio'>('library');
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({ name: '', bio: '' });

  useEffect(() => {
    if (address) {
      fetchLibrary();
      fetchProfile();
      fetchStats();
    }
  }, [address]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/profile/stats?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {}
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({ name: data.name || '', bio: data.bio || '' });
      }
    } catch (e) {}
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, ...editForm }),
      });
      if (res.ok) {
        setProfile({ ...profile, ...editForm });
        setIsEditing(false);
        toast.success('Profile updated!');
      }
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

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
            <p className="text-white/60 mb-8 text-lg">Connect your wallet to access all the premium content you've unlocked on PayStream.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-stacks-orange/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header */}
        <div className="mb-12 glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-white/60" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-24 h-24 rounded-2xl bg-stacks-orange/20 border border-stacks-orange/30 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-stacks-orange" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight mb-2">
                {profile?.name || "Anonymous Creator"}
              </h1>
              <p className="text-white/40 font-mono text-sm mb-4">{address}</p>
              {profile?.bio && (
                <p className="text-white/60 max-w-2xl leading-relaxed">{profile.bio}</p>
              )}
              
              {/* Creator Stats Mini-Dashboard */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 min-w-[120px]">
                  <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Total Earned</div>
                  {stats ? (
                    <div className="text-lg font-black text-stacks-orange">
                      {stats.totalEarned?.toFixed(1) || '0.0'} STX
                    </div>
                  ) : (
                    <div className="h-6 w-16 bg-white/5 animate-pulse rounded mt-1" />
                  )}
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 min-w-[120px]">
                  <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Items Sold</div>
                  {stats ? (
                    <div className="text-lg font-black text-white">{stats.itemsSold || '0'}</div>
                  ) : (
                    <div className="h-6 w-10 bg-white/5 animate-pulse rounded mt-1" />
                  )}
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 min-w-[120px]">
                  <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Reputation</div>
                  {stats ? (
                    <div className="text-lg font-black text-blue-400">{stats.reputation || '100'}%</div>
                  ) : (
                    <div className="h-6 w-12 bg-white/5 animate-pulse rounded mt-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md glass rounded-3xl border border-white/10 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">Edit Profile</h3>
                  <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-white/5">
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Display Name</label>
                    <input 
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Enter your name"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-stacks-orange/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Bio</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell the community about yourself"
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-stacks-orange/50 transition-colors resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full h-12 rounded-xl bg-stacks-orange hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-5 h-5" /> Save Changes
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-10 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('library')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'library' ? 'text-stacks-orange border-b-2 border-stacks-orange' : 'text-white/40 hover:text-white'}`}
          >
            My Library
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'portfolio' ? 'text-stacks-orange border-b-2 border-stacks-orange' : 'text-white/40 hover:text-white'}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'history' ? 'text-stacks-orange border-b-2 border-stacks-orange' : 'text-white/40 hover:text-white'}`}
          >
            Purchase History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === 'settings' ? 'text-stacks-orange border-b-2 border-stacks-orange' : 'text-white/40 hover:text-white'}`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'library' ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">Unlocked Content</h2>
              </div>
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
          </>
        ) : activeTab === 'history' ? (
          <div className="glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Content</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Transaction</th>
                    <th className="px-8 py-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...Array(2)].map((_, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-white">Cyberpunk Digital Art</div>
                        <div className="text-[10px] text-white/30">Art & Collectibles</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-mono text-sm text-stacks-orange-light font-bold">5.0 STX</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-white/40 group cursor-pointer" onClick={() => toast.success("TX ID copied!")}>
                          <span className="truncate w-32">dd17dcd8...2199</span>
                          <ExternalLink className="w-3 h-3 group-hover:text-stacks-orange transition-colors" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-white/40">
                        May 12, 2024
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="glass p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-stacks-orange" />
                Platform Preferences
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="text-sm font-bold">Email Notifications</div>
                    <div className="text-[10px] text-white/40">Receive alerts for new unlocks and messages</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-stacks-orange/20 border border-stacks-orange/40 relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-stacks-orange" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="text-sm font-bold">Public Profile</div>
                    <div className="text-[10px] text-white/40">Allow others to see your library and activity</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-white/10 border border-white/20 relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white/20" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <div className="text-sm font-bold">Marketing Analytics</div>
                    <div className="text-[10px] text-white/40">Share anonymous usage data to improve platform</div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-stacks-orange/20 border border-stacks-orange/40 relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-stacks-orange" />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex justify-end gap-4">
                <button className="px-6 py-2 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-colors">Discard</button>
                <button className="px-6 py-2 rounded-xl bg-stacks-orange text-white text-xs font-bold shadow-lg shadow-stacks-orange/20">Save Preferences</button>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-red-500/10 bg-red-500/5">
              <h3 className="text-xl font-bold mb-2 text-red-500">Danger Zone</h3>
              <p className="text-xs text-white/40 mb-6">Permanently delete your profile data from our servers. This will not affect your on-chain ownership records.</p>
              <button className="px-6 py-2 rounded-xl border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Delete Profile Data</button>
            </div>
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

// TODO: Add skeleton loader for profile header
