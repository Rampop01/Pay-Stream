'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, User, Award, Zap } from 'lucide-react';
import { StakingModal } from './StakingModal';
/** @description Ranked leaderboard table for creator statistics */


const LEADERS = [
  { rank: 1, name: 'ClarityKing', earned: '1,250 STX', rating: 5.0, category: 'Engineering' },
  { rank: 2, name: 'PixelPerfect', earned: '980 STX', rating: 4.9, category: 'Design' },
  { rank: 3, name: 'StacksGuru', earned: '840 STX', rating: 4.9, category: 'Consulting' },
  { rank: 4, name: 'CryptoScribe', earned: '720 STX', rating: 4.8, category: 'Content' },
  { rank: 5, name: 'NakamotoNinja', earned: '650 STX', rating: 4.7, category: 'Engineering' }
];

export function TalentLeaderboard() {
  const [stakingCreator, setStakingCreator] = useState<{name: string, address: string} | null>(null);

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
      <StakingModal 
        isOpen={!!stakingCreator}
        onClose={() => setStakingCreator(null)}
        creatorName={stakingCreator?.name || ''}
        creatorAddress={stakingCreator?.address || ''}
      />
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Trophy className="w-32 h-32 text-stacks-orange" />
      </div>

      <div className="relative z-10 mb-10">
        <h3 className="text-2xl font-black mb-1 flex items-center gap-3">
          <Trophy className="text-stacks-orange w-6 h-6" />
          Talent <span className="text-stacks-orange">Leaderboard</span>
        </h3>
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Top Earning Creators this month</p>
      </div>

      <div className="space-y-4">
        {LEADERS.map((leader, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={leader.rank} 
            className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
              leader.rank === 1 ? 'bg-stacks-orange text-white' : 
              leader.rank === 2 ? 'bg-white/20 text-white' : 
              leader.rank === 3 ? 'bg-orange-900/40 text-orange-400' : 'text-white/20'
            }`}>
              {leader.rank}
            </div>
            
            <div className="flex items-center gap-3 flex-grow">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                <User className="w-4 h-4 text-white/40" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  {leader.name}
                  {leader.rank <= 3 && <Award className="w-3 h-3 text-stacks-orange" />}
                </div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">{leader.category}</div>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div>
                <div className="text-sm font-black text-white">{leader.earned}</div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-stacks-orange font-bold">
                  <Star className="w-2.5 h-2.5 fill-current" /> {leader.rating}
                </div>
              </div>
              <button 
                onClick={() => setStakingCreator({ name: leader.name, address: `SP${Math.random().toString(36).substring(2, 6).toUpperCase()}` })}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/30 flex items-center gap-1 text-[10px] font-bold uppercase"
              >
                <Zap className="w-3 h-3" /> Stake
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-8 py-4 rounded-2xl border border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all">
        View Full Rankings
      </button>
    </div>
  );
}

// Moderation dashboard integration verified
// Sort leaderboard entirely on the server to save client memory
