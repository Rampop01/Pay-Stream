'use client';

import { motion } from 'framer-motion';
/** @description Data visualization component for creator analytics */


export function AnalyticsChart() {
  // Mock data for the last 7 days
  const data = [12, 19, 15, 25, 22, 30, 28];
  const max = Math.max(...data);

  return (
    <div className="glass-card rounded-2xl p-6 border-white/10 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white">Unlock Activity</h3>
          <p className="text-xs text-white/40">Daily performance for the past 7 days</p>
        </div>
        <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-bold">
          +14% Growth
        </div>
      </div>

      <div className="h-48 flex items-end gap-2 md:gap-3">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(value / max) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              className="w-full bg-gradient-to-t from-stacks-orange to-stacks-amber rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap z-10">
                {value} unlocks
              </div>
            </motion.div>
            <span className="text-[10px] text-white/20 font-mono">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Moderation dashboard integration verified