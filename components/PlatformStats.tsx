'use client';

import { motion } from 'framer-motion';
import { Activity, Users, DollarSign, Zap } from 'lucide-react';

export function PlatformStats() {
  const stats = [
    { label: 'Active Creators', value: '1,248', icon: Users, color: 'text-blue-400' },
    { label: 'Content Unlocked', value: '14.2k', icon: Zap, color: 'text-stacks-orange' },
    { label: 'Total Earnings', value: '85.4k STX', icon: DollarSign, color: 'text-green-400' },
    { label: 'Daily Activity', value: '98.2%', icon: Activity, color: 'text-purple-400' }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.03] transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
