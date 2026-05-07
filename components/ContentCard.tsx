'use client';

import { Content } from '@/lib/types';
import Link from 'next/link';
import { Zap, Play, User, Eye, Sparkles } from 'lucide-react';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/content/${content.id}`}>
      <div className="content-card relative cursor-pointer group h-full flex flex-col max-w-sm mx-auto w-full">
        {/* Thumbnail Image */}
        <div className="relative w-full aspect-video overflow-hidden flex-shrink-0">
          <img
            src={content.thumbnailUrl || '/placeholder.svg'}
            alt={content.title}
            className="content-card-image w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-4 py-1.5 rounded-full bg-stacks-orange text-white text-xs font-bold shadow-lg shadow-stacks-orange/30 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Now</span>
            </div>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-stacks-orange/40 text-stacks-orange font-bold text-[10px]">
              <Zap className="w-3 h-3 fill-stacks-orange" />
              {content.priceInSTX} STX
            </div>
          </div>

          {/* Category */}
          <div className="absolute top-3 left-3 z-10">
            <div className="px-2 py-1 rounded-full text-[9px] font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
              {content.category}
            </div>
          </div>
        </div>

        {/* Content info */}
        <div className="p-4 flex flex-col flex-1 bg-black/40">
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="font-bold text-base text-white group-hover:text-stacks-orange transition-colors duration-300">
              {content.title}
            </h3>
            <div className="flex items-center gap-0.5 text-stacks-orange-light">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold">Premium</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-white/50 text-[10px] mb-2.5">
             <User className="w-2.5 h-2.5" />
             <span className="line-clamp-1">{content.creatorName}</span>
          </div>

          <p className="text-xs text-white/60 line-clamp-2 leading-snug mb-3">
            {content.description}
          </p>

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/10">
            <div className="flex items-center gap-1 text-white/40">
              <Eye className="w-3 h-3" />
              <span className="text-[10px] font-medium">{content.totalUnlocks} Unlocks</span>
            </div>
            <div className="flex gap-1 text-[9px] text-white/40 italic">
              Verified on Stacks
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
