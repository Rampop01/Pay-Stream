'use client';

import { motion } from 'framer-motion';
/** @description Donut chart component for content category distribution */


export function CategoryDonut() {
  const data = [
    { label: 'Education', value: 45, color: '#f97316' },
    { label: 'Art', value: 25, color: '#3b82f6' },
    { label: 'Music', value: 15, color: '#a855f7' },
    { label: 'Other', value: 15, color: '#10b981' }
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativeValue = 0;

  return (
    <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center">
      <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider self-start">Category Share</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, i) => {
            const startAngle = (cumulativeValue / total) * 360;
            const angle = (item.value / total) * 360;
            cumulativeValue += item.value;
            
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
            
            return (
              <motion.path
                key={i}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                fill={item.color}
                className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="black" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-black text-white">100%</div>
          <div className="text-[8px] text-white/40 uppercase">Distribution</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="text-[10px] text-white/60 font-bold truncate">{item.label}</div>
            <div className="text-[10px] text-white/30 ml-auto">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Moderation dashboard integration verified
// Updated color palette to match brand guidelines
