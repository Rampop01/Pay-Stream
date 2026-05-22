'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
/** @description Financial summary cards for total STX earnings */


interface MetricProps {
  label: string;
  value: string;
  trend: number;
  data: number[];
}

export function RevenueSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard 
        label="Total Revenue" 
        value="4,285 STX" 
        trend={12.5} 
        data={[30, 45, 32, 50, 48, 60, 55, 65, 58, 70]} 
      />
      <MetricCard 
        label="Avg. Order Value" 
        value="3.2 STX" 
        trend={-2.4} 
        data={[50, 48, 52, 45, 42, 40, 43, 38, 35, 32]} 
      />
    </div>
  );
}

function MetricCard({ label, value, trend, data }: MetricProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</div>
          <div className="text-2xl font-black text-white">{value}</div>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="h-12 flex items-end gap-1">
        {data.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${((v - min) / range) * 80 + 20}%` }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className={`flex-1 rounded-t-[1px] ${trend > 0 ? 'bg-stacks-orange' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
