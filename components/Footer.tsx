import { Zap, Github, Twitter, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-20 pb-12 pt-20 border-t border-white/5 bg-black/40 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-stacks-orange/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-stacks-orange flex items-center justify-center shadow-lg shadow-stacks-orange/20 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">ContentStream</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              The world's first decentralized content marketplace powered by Bitcoin L2. 
              Monetize your premium videos, courses, and digital assets on-chain.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Marketplace</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/explore" className="hover:text-stacks-orange transition-colors">Discover</Link></li>
              <li><Link href="/explore?category=Education" className="hover:text-stacks-orange transition-colors">Education</Link></li>
              <li><Link href="/explore?category=Entertainment" className="hover:text-stacks-orange transition-colors">Entertainment</Link></li>
              <li><Link href="/explore?category=Technology" className="hover:text-stacks-orange transition-colors">Technology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">For Creators</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/create" className="hover:text-stacks-orange transition-colors">Start Selling</Link></li>
              <li><Link href="/dashboard" className="hover:text-stacks-orange transition-colors">Dashboard</Link></li>
              <li><Link href="/wallet" className="hover:text-stacks-orange transition-colors">Withdraw Royalties</Link></li>
              <li><Link href="/docs" className="hover:text-stacks-orange transition-colors">Clarity Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Stay Connected</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-stacks-orange/10 hover:border-stacks-orange/30 transition-all group">
                <Twitter className="w-4 h-4 text-white/40 group-hover:text-stacks-orange" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-stacks-orange/10 hover:border-stacks-orange/30 transition-all group">
                <Github className="w-4 h-4 text-white/40 group-hover:text-stacks-orange" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-stacks-orange/10 hover:border-stacks-orange/30 transition-all group">
                <Globe className="w-4 h-4 text-white/40 group-hover:text-stacks-orange" />
              </a>
            </div>
            <div className="p-4 rounded-xl bg-stacks-orange/5 border border-stacks-orange/10">
              <div className="text-[10px] font-bold text-stacks-orange uppercase mb-1">Network Status</div>
              <div className="text-xs text-white/60 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Stacks Mainnet Live
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20 font-medium">
            © 2024 ContentStream Protocol. Built with Stacks + Clarity.
          </p>
          <div className="flex items-center gap-1 text-[10px] text-white/20">
            Made with <Heart className="w-2 h-2 text-red-500 fill-red-500" /> by the Bitcoin Dev Community
          </div>
        </div>
      </div>
    </footer>
  );
}
