'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Shield, Clock, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorAddress: string;
}

export function CommissionModal({ isOpen, onClose, creatorName, creatorAddress }: CommissionModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    description: '',
    deadline: '',
    budget: '',
    tier: 'standard'
  });

  const handleSubmit = async () => {
    try {
      // API call mockup
      toast.success(`Commission request sent to ${creatorName}!`);
      onClose();
    } catch (e) {
      toast.error("Failed to send request");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl glass-strong rounded-[2.5rem] border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Hire <span className="text-stacks-orange">{creatorName}</span></h2>
                <p className="text-xs text-white/40 mt-1">Request a custom commission or private content</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-white/20" />
              </button>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Project Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe what you'd like the creator to build or create for you..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-stacks-orange/50 transition-colors resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Budget (STX)</label>
                      <div className="relative">
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stacks-orange" />
                        <input 
                          type="number" 
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          placeholder="50"
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-stacks-orange/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Deadline</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          type="date" 
                          value={formData.deadline}
                          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-stacks-orange/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.description || !formData.budget}
                    className="w-full h-14 rounded-2xl bg-stacks-orange hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-stacks-orange/20"
                  >
                    Next Step <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-4">
                    <TierCard 
                      title="Standard" 
                      price="Base" 
                      features={["High Quality", "3 Revisions", "7 Day Delivery"]}
                      selected={formData.tier === 'standard'}
                      onSelect={() => setFormData({...formData, tier: 'standard'})}
                    />
                    <TierCard 
                      title="Premium" 
                      price="+20 STX" 
                      features={["Source Files", "Unlimited Revisions", "48h Delivery", "Priority Support"]}
                      selected={formData.tier === 'premium'}
                      onSelect={() => setFormData({...formData, tier: 'premium'})}
                      highlight
                    />
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 h-14 rounded-2xl border border-white/10 hover:bg-white/5 text-white/40 font-bold transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className="flex-[2] h-14 rounded-2xl bg-stacks-orange hover:bg-orange-600 text-white font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-stacks-orange/20"
                    >
                      Confirm & Send Request
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
              <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                <Shield className="w-3 h-3 text-green-500" /> Secure Escrow Payment via Stacks
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TierCard({ title, price, features, selected, onSelect, highlight }: any) {
  return (
    <button 
      onClick={onSelect}
      className={`w-full p-5 rounded-3xl border text-left transition-all ${selected ? 'bg-stacks-orange/10 border-stacks-orange' : 'bg-white/5 border-white/10 hover:border-white/20'} ${highlight ? 'relative overflow-hidden' : ''}`}
    >
      {highlight && <div className="absolute top-0 right-0 px-3 py-1 bg-stacks-orange text-[8px] font-black uppercase text-white rounded-bl-xl">Recommended</div>}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected ? 'bg-stacks-orange text-white' : 'bg-white/10 text-white/40'}`}>
            <Star className="w-4 h-4" />
          </div>
          <span className="font-bold text-white">{title}</span>
        </div>
        <div className="text-xs font-black text-stacks-orange">{price}</div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-center gap-1 text-[9px] text-white/40 font-bold uppercase tracking-wider">
            <div className="w-1 h-1 rounded-full bg-stacks-orange" /> {f}
          </div>
        ))}
      </div>
    </button>
  );
}
