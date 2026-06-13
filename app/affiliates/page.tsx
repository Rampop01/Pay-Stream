'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWalletStore } from '@/lib/store';
import { Network, TrendingUp, DollarSign, Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Navbar = dynamic(() => import('@/components/Navbar').then(m => m.Navbar), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer').then(m => m.Footer), { ssr: false });

export default function AffiliatesPage() {
  const { address } = useWalletStore();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchEarnings();
    } else {
      setIsLoading(false);
    }
  }, [address]);

  const fetchEarnings = async () => {
    try {
      const res = await fetch(`/api/affiliates?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setEarnings(data);
      }
    } catch (e) {
      toast.error('Failed to load affiliate earnings');
    } finally {
      setIsLoading(false);
    }
  };

  const totalEarned = earnings.reduce((acc, curr) => acc + curr.amountSTX, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />

      <div className="orb orb-purple w-[500px] h-[500px] -top-24 -right-24 opacity-20" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-white mb-2 flex items-center gap-3">
              <Network className="w-8 h-8 text-purple-400" /> Affiliate Hub
            </h1>
            <p className="text-white/60">Generate links, refer friends, and earn 10% commission on every unlock.</p>
          </div>
        </div>

        {!address ? (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">You need to connect your wallet to access the Affiliate Hub.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white/60 text-sm font-medium mb-1">Total Earned</h3>
                <div className="text-3xl font-bold text-white">{totalEarned.toLocaleString()} STX</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-white/60 text-sm font-medium mb-1">Total Referrals</h3>
                <div className="text-3xl font-bold text-white">{earnings.length}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white/60 text-sm font-medium mb-1">Conversion Rate</h3>
                <div className="text-3xl font-bold text-white">10%</div>
              </div>
            </div>

            {/* Earnings History */}
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Recent Commissions</h3>
              </div>
              <div className="p-0">
                {earnings.length === 0 ? (
                  <div className="p-8 text-center text-white/40">
                    No commissions yet. Go to Explore, click a content item, and generate your link!
                  </div>
                ) : (
                  <table className="w-full text-left text-sm text-white/60">
                    <thead className="text-xs uppercase bg-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium">Buyer</th>
                        <th className="px-6 py-4 font-medium">Content ID</th>
                        <th className="px-6 py-4 font-medium">Commission (STX)</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {earnings.sort((a, b) => b.timestamp - a.timestamp).map((earning) => (
                        <tr key={earning.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-purple-400">
                            {earning.buyerAddress.slice(0, 5)}...{earning.buyerAddress.slice(-4)}
                          </td>
                          <td className="px-6 py-4 font-mono">{earning.contentId.slice(0, 8)}...</td>
                          <td className="px-6 py-4 font-bold text-green-400">+{earning.amountSTX} STX</td>
                          <td className="px-6 py-4">
                            {new Date(earning.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
