'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Content } from '@/lib/types';
import { 
  BarChart3, 
  Users, 
  Zap, 
  Settings, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  PlusCircle,
  Loader2,
  TrendingUp,
  User
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { EditContentModal } from '@/components/EditContentModal';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsChart } from '@/components/AnalyticsChart';

export default function CreatorDashboard() {
  const { address } = useWalletStore();
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (address) {
      fetchCreatorContent();
    }
  }, [address]);

  const fetchCreatorContent = async () => {
    try {
      const res = await fetch(`/api/content?creatorAddress=${address}`);
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Could not load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this content? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Content removed successfully');
        fetchCreatorContent();
      } else {
        toast.error('Failed to remove content');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting');
    }
  };

  const totalUnlocks = content.reduce((sum, item) => sum + (item.totalUnlocks || 0), 0);
  const totalEarnings = content.reduce((sum, item) => sum + ((item.totalUnlocks || 0) * item.priceInSTX), 0);
  const avgPrice = content.length > 0 ? (content.reduce((sum, item) => sum + item.priceInSTX, 0) / content.length).toFixed(1) : 0;

  if (!address) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="glass p-12 rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <Zap className="w-16 h-16 text-stacks-orange mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-white/60 mb-8 text-lg">Please connect your Stacks wallet to view your creator dashboard and analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-stacks-orange/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Creator Dashboard</h1>
            <p className="text-white/50 text-lg flex items-center gap-2">
              Managing your decentralized content stream
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </p>
          </div>
          <Link href="/create">
            <button className="btn-stacks group flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Upload New Content
            </button>
          </Link>
        </div>

        {/* Stats & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Stats Column */}
          <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <StatCard 
              icon={<TrendingUp className="w-5 h-5" />} 
              label="Total Earnings" 
              value={`${totalEarnings} STX`} 
              color="from-orange-500/20 to-amber-500/20"
              textColor="text-stacks-orange"
            />
            <StatCard 
              icon={<Users className="w-5 h-5" />} 
              label="Total Unlocks" 
              value={totalUnlocks.toString()} 
              color="from-blue-500/20 to-indigo-500/20"
              textColor="text-blue-400"
            />
          </div>

          {/* Chart Column */}
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <StatCard 
            icon={<Zap className="w-5 h-5" />} 
            label="Live Content" 
            value={content.length.toString()} 
            color="from-purple-500/20 to-pink-500/20"
            textColor="text-purple-400"
          />
          <StatCard 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Avg. Price" 
            value={`${avgPrice} STX`} 
            color="from-emerald-500/20 to-teal-500/20"
            textColor="text-emerald-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Main Table Area */}
          <div className="lg:col-span-2 glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Content</h2>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Settings className="w-4 h-4" />
                Auto-updating via Hiro API
              </div>
            </div>

            <div className="">
              {/* ... table content remains same ... */}
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-lg skeleton-stacks" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-1/3 skeleton-stacks" />
                        <Skeleton className="h-3 w-1/4 skeleton-stacks" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : content.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-6">
                  <h3 className="text-xl font-bold">No content yet</h3>
                  <p className="text-white/40 text-sm">Upload content to see your dashboard come alive.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-white/40 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Content</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Unlocks</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {content.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                  <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-bold text-white group-hover:text-stacks-orange transition-colors truncate w-32">{item.title}</div>
                                  <div className="text-[10px] text-white/40">{item.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{item.priceInSTX} STX</td>
                            <td className="px-6 py-4 font-mono text-xs">{item.totalUnlocks || 0}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/content/${item.id}`} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button 
                                  onClick={() => { setSelectedContent(item); setIsEditModalOpen(true); }}
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-white/40 hover:text-red-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-white/5">
                    {content.map((item) => (
                      <div key={item.id} className="p-4 space-y-3">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                            <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-white truncate">{item.title}</div>
                            <div className="flex gap-3 mt-1">
                              <span className="text-[10px] text-white/40 font-mono">{item.priceInSTX} STX</span>
                              <span className="text-[10px] text-stacks-orange-light font-mono">{item.totalUnlocks || 0} Unlocks</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/content/${item.id}`} className="flex-1 h-8 rounded-lg bg-white/5 flex items-center justify-center gap-2 text-[10px] font-bold border border-white/10">
                            View
                          </Link>
                          <button onClick={() => { setSelectedContent(item); setIsEditModalOpen(true); }} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass rounded-3xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-stacks-orange" /> Recent Activity
              </h3>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    {i < 2 && <div className="absolute left-4 top-10 bottom-0 w-px bg-white/5" />}
                    <div className="w-8 h-8 rounded-full bg-stacks-orange/10 flex items-center justify-center flex-shrink-0 border border-stacks-orange/20">
                      <Users className="w-4 h-4 text-stacks-orange" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">New Unlock</div>
                      <div className="text-xs text-white/40 mb-1">SP1B...W38M unlocked "Cyberpunk Art"</div>
                      <div className="text-[10px] text-stacks-orange-light font-mono font-bold">+5.0 STX</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2 text-xs text-white/30 hover:text-white transition-colors border-t border-white/5 pt-4">
                View Transaction History
              </button>
            </div>

            <div className="glass rounded-3xl border border-white/10 p-6 bg-gradient-to-br from-stacks-orange/10 to-transparent">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Creator Tip</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Consistency is key. Creators who upload at least twice a week see 40% more unlocks than those who don't.
              </p>
            </div>
          </div>
        </div>

        <EditContentModal 
          content={selectedContent}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchCreatorContent}
        />
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, textColor }: any) {
  return (
    <div className={`p-6 rounded-3xl glass border border-white/10 relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-white/40 mb-4">
          <div className="p-2 rounded-lg bg-white/5">
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        </div>
        <div className={`text-3xl font-black ${textColor}`}>{value}</div>
      </div>
    </div>
  );
}
