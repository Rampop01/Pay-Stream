'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Zap, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
/** @description Showcase component for top performing creators */


const TALENT = [
  { id: 't1', name: 'Alice Smith', role: 'Clarity Dev', rating: 4.9, address: 'SP1...X123', bio: 'Expert in DeFi smart contracts.' },
  { id: 't2', name: 'Bob Jones', role: '3D Artist', rating: 4.8, address: 'SP2...Y456', bio: 'High-end metaverse assets.' },
  { id: 't3', name: 'Charlie Day', role: 'UX Designer', rating: 5.0, address: 'SP3...Z789', bio: 'Web3 native interface design.' }
];

export function TopTalent() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-4">Top <span className="text-stacks-orange">Talent</span></h2>
            <p className="text-white/40 max-w-md">The most skilled creators and developers in the Stacks ecosystem.</p>
          </div>
          <Link href="/explore?tab=talent" className="text-sm font-bold text-white/40 hover:text-stacks-orange transition-colors flex items-center gap-2 mb-4">
            View all Talent <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TALENT.map((t, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={t.id} 
              className="glass group p-8 rounded-[2rem] border border-white/10 hover:border-stacks-orange/50 transition-all duration-500 hover:shadow-2xl hover:shadow-stacks-orange/10"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-stacks-orange/10 flex items-center justify-center border border-stacks-orange/20 group-hover:bg-stacks-orange group-hover:text-white transition-all">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-stacks-orange">
                  <Star className="w-3 h-3 fill-current" /> {t.rating}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
              <div className="text-xs text-stacks-orange font-black uppercase tracking-widest mb-4">{t.role}</div>
              
              <p className="text-sm text-white/40 mb-8 line-clamp-2">{t.bio}</p>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] font-mono text-white/20">{t.address.slice(0, 10)}...</div>
                <Link href={`/profile/${t.address}`}>
                  <button className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all">
                    View Portfolio
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Moderation dashboard integration verified
// Validate avatar URLs before rendering to prevent broken images
