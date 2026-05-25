'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UnlockSuccess({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -20 }}
            className="relative p-12 rounded-full flex items-center justify-center pointer-events-auto"
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-stacks-orange/20 blur-[100px] animate-pulse" />
            
            <div className="relative glass-strong p-8 rounded-full border border-stacks-orange/30 shadow-[0_0_50px_rgba(252,100,50,0.3)]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-stacks-orange flex items-center justify-center text-white"
              >
                <Check className="w-10 h-10 stroke-[3]" />
              </motion.div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 80,
                    y: Math.sin(i * 60 * Math.PI / 180) * 80
                  }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Sparkles className="w-5 h-5 text-stacks-amber" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-[calc(100%+20px)] text-center whitespace-nowrap"
            >
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">CONTENT UNLOCKED!</h2>
              <div className="flex items-center justify-center gap-2 text-stacks-orange-light font-bold">
                <Zap className="w-4 h-4 fill-current" />
                <span>Transaction Confirmed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Moderation dashboard integration verified