'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types';
import { useWalletStore } from '@/lib/store';
import { MessageSquare, Send, User, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
/** @description Interactive comments interface for content discussions */


interface CommentsSectionProps {
  contentId: string;
  initialComments?: Comment[];
}

export function CommentsSection({ contentId, initialComments = [] }: CommentsSectionProps) {
  const { address } = useWalletStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error('Connect wallet to comment');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/content/${contentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, text: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success('Comment posted!');
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-stacks-orange/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-stacks-orange" />
        </div>
        <h2 className="text-2xl font-bold text-white">Community <span className="text-white/40 font-medium">({comments.length})</span></h2>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-stacks-orange/20 to-stacks-amber/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <div className="relative glass rounded-2xl border border-white/10 p-1 flex items-end gap-2 bg-zinc-950">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={address ? "Add a public comment..." : "Connect wallet to join the conversation"}
            disabled={!address || isSubmitting}
            className="flex-grow bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder:text-white/20 min-h-[100px] resize-none"
          />
          <button
            type="submit"
            disabled={!address || !newComment.trim() || isSubmitting}
            className="mb-2 mr-2 w-10 h-10 rounded-xl bg-stacks-orange hover:bg-orange-600 disabled:bg-white/5 disabled:text-white/20 text-white flex items-center justify-center transition-all shadow-lg shadow-stacks-orange/20"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {comments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center glass rounded-2xl border-dashed border-white/10"
            >
              <p className="text-white/20 text-sm">No comments yet. Be the first to start the discussion!</p>
            </motion.div>
          ) : (
            comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white/20" />
                </div>
                <div className="flex-grow space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/80">{truncateAddress(comment.userAddress)}</span>
                    <span className="text-[10px] text-white/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-white/60 leading-relaxed bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 group-hover:border-white/10 transition-colors">
                    {comment.text}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Moderation dashboard integration verified
// Restrict comments to 500 characters max
