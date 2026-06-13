'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AffiliateLinkGeneratorProps {
  contentId: string;
  userAddress: string;
}

export function AffiliateLinkGenerator({ contentId, userAddress }: AffiliateLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    // Determine base URL dynamically depending on environment
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://paystream.app';
    return `${baseUrl}/content/${contentId}?ref=${userAddress}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateLink());
      setCopied(true);
      toast.success('Affiliate link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4 mt-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Earn 10% Commission
          </h4>
          <p className="text-xs text-purple-200/60 mt-1">
            Share this unique link. When someone unlocks the content, you instantly earn 10% of the STX.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-grow bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-gray-400 truncate select-all">
          {generateLink()}
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 bg-purple-500 hover:bg-purple-400 text-white p-2 rounded-lg transition-colors"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
