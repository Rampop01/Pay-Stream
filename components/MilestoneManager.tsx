'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, DollarSign, ArrowRight, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'completed' | 'released';
  description: string;
}

export function MilestoneManager({ milestones, totalBudget }: { milestones: Milestone[], totalBudget: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white">Project Milestones</h3>
          <p className="text-xs text-white/40">Track progress and secure payments through escrow.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Budget</div>
          <div className="text-2xl font-black text-stacks-orange">{totalBudget} STX</div>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={milestone.id} 
            className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-6 group hover:border-stacks-orange/30 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              milestone.status === 'released' ? 'bg-green-500/10 text-green-400' : 
              milestone.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : 
              'bg-white/5 text-white/20'
            }`}>
              {milestone.status === 'released' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-white">{milestone.title}</h4>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  milestone.status === 'released' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'
                }`}>
                  {milestone.status}
                </span>
              </div>
              <p className="text-xs text-white/40">{milestone.description}</p>
            </div>

            <div className="text-right flex flex-col items-end gap-2">
              <div className="text-sm font-black text-white">{milestone.amount} STX</div>
              {milestone.status === 'completed' && (
                <button className="px-4 py-1.5 rounded-lg bg-stacks-orange text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-stacks-orange/20">
                  Release STX
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-stacks-orange/5 border border-stacks-orange/20 flex items-center gap-4">
        <Shield className="w-8 h-8 text-stacks-orange opacity-40" />
        <p className="text-[11px] text-white/50 leading-relaxed">
          Payments for each milestone are held in the **ContentStream Escrow Contract**. 
          Funds are only released to the creator once you approve the work or the milestone is completed.
        </p>
      </div>
    </div>
  );
}
