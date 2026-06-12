'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Zap, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useWalletStore } from '@/lib/store';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorAddress: string;
  creatorName: string;
}

export function StakingModal({ isOpen, onClose, creatorAddress, creatorName }: StakingModalProps) {
  const { address } = useWalletStore();
  const [amount, setAmount] = useState('100');
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    if (!address) {
      toast.error('Connect wallet to stake');
      return;
    }
    
    setIsStaking(true);
    try {
      // Simulate on-chain staking
      await new Promise(r => setTimeout(r, 2000));
      
      const res = await fetch('/api/stakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorAddress,
          stakerAddress: address,
          amountSTX: parseInt(amount)
        })
      });
      
      if (!res.ok) throw new Error('Failed to stake');
      
      toast.success(`Successfully staked ${amount} STX on ${creatorName}!`);
      onClose();
    } catch (err) {
      toast.error('Transaction failed');
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 relative">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Stake to Boost</h2>
                  <p className="text-sm text-gray-400">Creator: {creatorName}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Amount (STX)</span>
                    <span className="text-purple-400">Balance: 1,240 STX</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white text-lg focus:outline-none focus:border-purple-500/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500">STX</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Est. APY</p>
                    <p className="text-lg font-bold text-green-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" /> 14.2%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Lock Period</p>
                    <p className="text-lg font-bold text-white flex items-center gap-1">
                      <Lock className="w-4 h-4 text-gray-400" /> 14 Days
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-200">
                  Staking boosts the creator's visibility on the platform and earns you a 5% cut of their future content sales.
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={isStaking || !amount || parseInt(amount) <= 0}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStaking ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Stake {amount || 0} STX <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
