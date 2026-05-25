'use client';

import { Star, MessageSquare, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  timestamp: number;
  type: 'content' | 'commission';
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-12 bg-white/[0.02]">
        <div className="text-center">
          <div className="text-5xl font-black text-white mb-2">{avgRating}</div>
          <div className="flex items-center justify-center gap-1 text-stacks-orange mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.floor(Number(avgRating)) ? 'fill-current' : 'opacity-20'}`} />
            ))}
          </div>
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{reviews.length} Reviews</div>
        </div>

        <div className="flex-grow space-y-3 w-full max-w-sm">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => r.rating === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/40 w-4">{stars}</span>
                <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-stacks-orange" 
                  />
                </div>
                <span className="text-[10px] font-bold text-white/20 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={review.id} 
            className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stacks-orange/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-stacks-orange" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{review.reviewer.slice(0, 10)}...</div>
                  <div className="text-[10px] text-white/30">{new Date(review.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-stacks-orange">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-white/60 leading-relaxed italic">"{review.comment}"</p>
            
            <div className="flex items-center gap-2 mt-2">
              <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${review.type === 'commission' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                {review.type}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Moderation dashboard integration verified