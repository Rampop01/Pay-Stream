'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerContentContract } from '@/lib/contract';
import { useWalletStore } from '@/lib/store';
import { toast } from 'sonner';
import { Loader2, Sparkles, Zap, Image as ImageIcon, Type, Layout } from 'lucide-react';

export function CreateContentForm() {
  const router = useRouter();
  const { address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Video',
    thumbnailUrl: '',
    embedUrl: '',
    price: 10
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    
    try {
      await registerContentContract({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price * 1000000, // microSTX
        onFinish: async (data) => {
          // Add to local DB
          const response = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              creatorAddress: address,
              creatorName: 'Anonymous Creator', // In a real app, get from profile
            }),
          });

          if (response.ok) {
            toast.success('Content registered successfully!');
            router.push('/explore');
          } else {
            toast.error('Failed to save content to database');
          }
          setIsLoading(false);
        },
        onCancel: () => {
          toast.error('Transaction cancelled');
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Type className="w-4 h-4" /> Title
          </label>
          <input
            required
            type="text"
            placeholder="Amazing Content Title"
            className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors text-white"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Layout className="w-4 h-4" /> Category
          </label>
          <select
            className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors text-white"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Video">Video</option>
            <option value="Art">Art</option>
            <option value="Music">Music</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Description</label>
        <textarea
          required
          rows={3}
          placeholder="Tell us what this content is about..."
          className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors text-white resize-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Thumbnail URL
          </label>
          <input
            required
            type="url"
            placeholder="https://..."
            className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors text-white"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Price (STX)
          </label>
          <input
            required
            type="number"
            min="1"
            className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors text-white"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Content URL (YouTube/Vimeo/etc.)</label>
        <input
          required
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors text-white"
          value={formData.embedUrl}
          onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
        />
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full h-12 bg-stacks-orange hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-stacks-orange/20"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Register Content on Stacks
          </>
        )}
      </button>
    </form>
  );
}
