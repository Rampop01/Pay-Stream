'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletStore } from '@/lib/store';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'unlock' | 'system' | 'report';
  timestamp: number;
  read: boolean;
  link?: string;
}

export function NotificationCenter() {
  const { address } = useWalletStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (address) {
      fetchNotifications();
    }
  }, [address]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?address=${address}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {}
  };

  const markAsRead = async (ids: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, notificationIds: ids }),
      });
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n)
        );
      }
    } catch (e) {}
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
      toast.success('All notifications marked as read');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group"
      >
        <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-stacks-orange' : 'text-white/40 group-hover:text-white'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 glass-strong rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-bold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black uppercase tracking-widest text-stacks-orange hover:text-stacks-orange-light transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-xs text-white/40 italic">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-white/[0.02] transition-colors relative group ${!n.read ? 'bg-stacks-orange/5' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            n.type === 'unlock' ? 'bg-green-500/10 text-green-400' : 
                            n.type === 'report' ? 'bg-red-500/10 text-red-400' : 
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {n.type === 'unlock' ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-bold text-white truncate pr-4">{n.title}</span>
                              <span className="text-[10px] text-white/20 whitespace-nowrap">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed mb-2">{n.message}</p>
                            {!n.read && (
                              <button 
                                onClick={() => markAsRead([n.id])}
                                className="text-[10px] font-bold text-stacks-orange hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white/[0.02] border-t border-white/10 text-center">
                <button className="text-[10px] font-bold text-white/40 hover:text-white transition-colors">
                  View all activity
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
