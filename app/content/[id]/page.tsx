'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentById } from '@/hooks/useContent';
import { Play, Share2, ArrowLeft, Sparkles, Zap, ShieldCheck, Globe, Star, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { unlockContentContract } from '@/lib/contract';
import { useWalletStore } from '@/lib/store';

const Navbar = dynamic(() => import('@/components/Navbar').then((mod) => mod.Navbar), { ssr: false });

export default function ContentPage() {
  const params = useParams();
  const contentId = params.id as string;
  const { data: content, isLoading, error } = useContentById(contentId);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { address } = useWalletStore();

  const handleUnlock = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!content) return;

    setIsUnlocking(true);
    try {
      await unlockContentContract({
        creatorAddress: content.creatorAddress,
        senderAddress: address,
        amountInSTX: content.priceInSTX,
        onFinish: async (data) => {
          // Verify on backend
          const response = await fetch(`/api/content/${contentId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ txId: data.txId }),
          });

          if (response.ok) {
            setIsUnlocked(true);
            toast.success('Content unlocked successfully!');
          } else {
            toast.error('Failed to verify transaction');
          }
          setIsUnlocking(false);
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
          setIsUnlocking(false);
        }
      });
    } catch (err) {
      toast.error('Unlock failed');
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-[200px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Content not found</h2>
        <Link href="/explore" className="text-stacks-orange hover:underline">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="orb orb-orange w-[500px] h-[500px] -top-24 -right-24 opacity-20" />
      <div className="orb orb-amber w-[400px] h-[400px] bottom-24 -left-24 opacity-15" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/explore" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 group"
            >
              {isUnlocked ? (
                <iframe 
                  src={content.embedUrl} 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={content.thumbnailUrl} 
                      className="w-full h-full object-cover opacity-30 blur-sm"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/60" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-stacks-orange" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">This content is locked</h2>
                    <p className="text-white/60 max-w-md mx-auto">
                      Unlock this premium content by {content.creatorName} for {content.priceInSTX} STX. 
                      Payment is handled securely on the Stacks blockchain.
                    </p>
                    <button 
                      onClick={handleUnlock}
                      disabled={isUnlocking}
                      className="px-8 h-12 rounded-full bg-stacks-orange hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-stacks-orange/20 flex items-center gap-2 mx-auto"
                    >
                      {isUnlocking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      Unlock Now for {content.priceInSTX} STX
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/80 border border-white/10">
                  {content.category}
                </span>
                <span className="flex items-center gap-1.5 text-stacks-orange text-sm font-bold">
                  <Sparkles className="w-4 h-4" /> Verified Creator
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
              <p className="text-lg text-white/60 leading-relaxed whitespace-pre-wrap">
                {content.description}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-stacks-orange" /> Creator Info
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-stacks-orange/20 flex items-center justify-center font-bold text-stacks-orange">
                  {content.creatorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{content.creatorName}</div>
                  <div className="text-xs text-white/40 truncate w-32">{content.creatorAddress}</div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Registration</span>
                  <span className="text-white/80">{new Date(content.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Total Unlocks</span>
                  <span className="text-white/80 font-bold">{content.totalUnlocks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Network</span>
                  <span className="text-white/80 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Mainnet
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 border-white/10 bg-stacks-orange/5"
            >
              <div className="flex items-center gap-2 text-stacks-orange font-bold mb-2">
                <Zap className="w-4 h-4" /> On-Chain Monetization
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                This content uses Stacks smart contracts to handle access. When you unlock, STX is sent directly to the creator's wallet.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
