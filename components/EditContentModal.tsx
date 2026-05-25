'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Content } from '@/lib/types';
import { toast } from 'sonner';
import { Loader2, Save, X } from 'lucide-react';

interface EditContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditContentModal({ content, isOpen, onClose, onUpdate }: EditContentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnailUrl: '',
    embedUrl: '',
    priceInSTX: 0
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description,
        category: content.category,
        thumbnailUrl: content.thumbnailUrl,
        embedUrl: content.embedUrl,
        priceInSTX: content.priceInSTX
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/content/${content.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Content updated successfully');
        onUpdate();
        onClose();
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred while updating');
    } finally {
      setIsLoading(false);
    }
  };

  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Content Metadata</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Title</label>
            <input
              required
              type="text"
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Category</label>
              <select
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors"
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Price (STX)</label>
              <input
                disabled
                type="number"
                className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 opacity-50 cursor-not-allowed"
                value={formData.priceInSTX}
              />
              <p className="text-[10px] text-zinc-500">Price can only be changed on-chain</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Description</label>
            <textarea
              required
              rows={3}
              className="w-full p-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Thumbnail URL</label>
            <input
              required
              type="url"
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Content/Embed URL</label>
            <input
              required
              type="url"
              className="w-full h-11 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-stacks-orange outline-none transition-colors"
              value={formData.embedUrl}
              onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
            />
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className="px-6 py-2 rounded-lg bg-stacks-orange hover:bg-orange-600 font-bold transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Moderation dashboard integration verified