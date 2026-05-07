'use client';

import dynamic from 'next/dynamic';
import { ContentCard } from '@/components/ContentCard';

const Navbar = dynamic(() => import('@/components/Navbar').then((mod) => mod.Navbar), {
  ssr: false,
});
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/useContent';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Layers,
  Lock,
  Sparkles,
  TrendingUp,
  Briefcase,
  Search,
  User,
  Play,
} from 'lucide-react';

function LightningBolt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
    </svg>
  );
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="stat-card rounded-xl p-6 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold gradient-text-stacks mb-1">
        {value}
      </div>
      <div className="text-sm text-white/40">{label}</div>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="glass-card mirror-card rounded-xl p-6 group cursor-default"
    >
      <div className="icon-glow w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-stacks-orange-light" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}


export default function Page() {
  const { content, isLoading, error } = useContent();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid hero-grid-fade" />

        {/* Animated orbs — big and bright */}
        <div className="orb orb-orange w-[600px] h-[600px] -top-48 -left-48 opacity-40" />
        <div className="orb orb-amber w-[500px] h-[500px] top-10 -right-40 opacity-35" />
        <div className="orb orb-warm w-[350px] h-[350px] bottom-0 left-1/3 opacity-25" />

        {/* Lightning bolts */}
        <div className="absolute top-20 left-[10%] lightning-flash" style={{ filter: 'drop-shadow(0 0 12px rgba(252,100,50,0.8))' }}>
          <LightningBolt className="w-12 h-12 text-stacks-orange/70" />
        </div>
        <div className="absolute top-48 right-[15%] lightning-flash" style={{ animationDelay: '2s', filter: 'drop-shadow(0 0 15px rgba(252,100,50,0.9))' }}>
          <LightningBolt className="w-14 h-14 text-stacks-orange/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-white">Monetize Your Content.</span>
              <br />
              <span className="gradient-text-stacks">Directly on Stacks.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The first decentralized content marketplace powered by{' '}
              <span className="text-stacks-orange-light font-medium">Clarity Smart Contracts</span>{' '}
              and the{' '}
              <span className="text-stacks-amber font-medium">Stacks blockchain</span>.
              Unlock premium creations with instant STX payments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/create">
                <button className="btn-stacks h-12 px-8 rounded-lg text-white font-semibold flex items-center gap-2 text-base">
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/explore">
                <button className="btn-outline-glow h-12 px-8 rounded-lg text-white font-medium flex items-center gap-2 text-base">
                  <Search className="w-4 h-4" />
                  <span>Explore Content</span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <AnimatedCounter value="Clarity" label="On-Chain Access" />
              <AnimatedCounter value="STX" label="Instant Royalties" />
              <AnimatedCounter value="100%" label="Creator Share" />
              <AnimatedCounter value="Global" label="Content Distribution" />
            </motion.div>
          </div>
        </div>

        <div className="section-divider" />
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why <span className="gradient-text-fire">ContentStream</span>?
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              We bridge the gap between global creators and audiences through decentralized identity and instant, trustless payments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Play} title="Direct Unlocking" description="No middlemen, no platform fees. Unlock content directly by interacting with our Clarity smart contracts." delay={0} />
            <FeatureCard icon={Lock} title="Secure Access" description="Content is locked behind on-chain verification, ensuring only authorized buyers can access premium work." delay={0.1} />
            <FeatureCard icon={Shield} title="Creator Ownership" description="Your content and metadata are registered on-chain, preserving your digital ownership and rights." delay={0.2} />
            <FeatureCard icon={Layers} title="Stacks Native" description="Fully integrated with the Stacks ecosystem. Support for SIP-009 NFTs and SIP-010 tokens." delay={0.3} />
            <FeatureCard icon={Globe} title="Global Reach" description="Monetize your work for a global audience without worrying about traditional payment gateway restrictions." delay={0.4} />
            <FeatureCard icon={TrendingUp} title="On-Chain Earnings" description="Every unlock is recorded on-chain, building your verifiable revenue history on the Stacks explorer." delay={0.5} />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* HOW IT WORKS */}
      <section className="relative py-24 how-it-works-bg bg-gradient-to-br from-stacks-orange via-orange-600 to-stacks-orange-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  How It <span className="text-black/80">Works</span>
                </h2>
                <p className="text-white/80 mb-10">
                  ContentStream leverages Clarity smart contracts to manage access and payments securely.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  { step: 1, title: 'Connect Wallet', desc: 'Link your Leather or Xverse wallet to create your creator identity.' },
                  { step: 2, title: 'Upload & Register', desc: 'Set your title, category, and price. Your content metadata is stored in the ContentHub contract.' },
                  { step: 3, title: 'Sell Access', desc: 'Audiences browse and pay STX to unlock your content. All logic is handled by the smart contract.' },
                  { step: 4, title: 'Earn & Grow', desc: 'Receive instant payments and build your on-chain reputation as a successful creator.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/30 border border-white/40 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/20">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contract Flow Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flow-card-dark rounded-2xl p-8 relative"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-stacks-orange/20 via-transparent to-stacks-orange/10 blur-sm -z-10" />

              <div className="space-y-4">
                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stacks-orange/15 border border-stacks-orange/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-stacks-orange-light" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Content Registration</div>
                    <div className="text-xs text-white/50 font-mono">(register-content ...)</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="spark-connector spark-connector-1" />
                </div>

                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3 !border-yellow-400/25">
                  <div className="w-10 h-10 rounded-lg bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center">
                    <Search className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-yellow-300">Audience Discovery</div>
                    <div className="text-xs text-white/50">Browsing on-chain marketplace</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="spark-connector spark-connector-2" />
                </div>

                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stacks-orange/15 border border-stacks-orange/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-stacks-orange-light" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Smart Contract Unlock</div>
                    <div className="text-xs text-white/50">(unlock-content ...)</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="spark-connector spark-connector-3" />
                </div>

                <div className="flow-step-dark rounded-lg p-4 flex items-center gap-3 !border-green-400/25">
                  <div className="w-10 h-10 rounded-lg bg-green-400/15 border border-green-400/25 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-green-400">On-Chain Proof</div>
                    <div className="text-xs text-white/50">Access & Royalty Confirmed</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FEATURED CONTENT */}
      <section id="content" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Featured <span className="gradient-text-stacks">Creations</span>
              </h2>
              <p className="text-white/40">
                Premium content ready to be unlocked
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/explore">
                <button className="btn-outline-glow h-10 px-6 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  View All
                </button>
              </Link>
              <Link href="/create">
                <button className="btn-stacks h-10 px-6 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Join Now
                </button>
              </Link>
            </div>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 glass-card rounded-xl border-red-500/20 mb-8">
              <p className="font-semibold text-red-400 mb-1">Error loading content</p>
              <p className="text-sm text-white/40">{error}</p>
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-video skeleton-stacks rounded-xl" />
                  <Skeleton className="h-4 w-3/4 skeleton-stacks rounded" />
                  <Skeleton className="h-4 w-1/2 skeleton-stacks rounded" />
                </div>
              ))}
            </div>
          ) : content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {content.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="h-full"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ContentCard content={item} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 glass-card rounded-2xl"
            >
              <div className="icon-glow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-stacks-orange-light" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No content registered yet</h3>
              <p className="text-white/40 mb-6 max-w-md mx-auto">
                Be the first creator on ContentStream. Showcase your work and start earning STX.
              </p>
              <Link href="/create">
                <button className="btn-stacks h-11 px-6 rounded-lg text-white font-semibold inline-flex items-center gap-2">
                  <span>Register Content</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stacks-orange to-stacks-amber flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">ContentStream</span>
              <span className="text-xs text-white/40">On-Chain Content Marketplace</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <a href="https://docs.stacks.co/" target="_blank" rel="noopener noreferrer" className="hover:text-stacks-orange-light transition-colors">Stacks Docs</a>
              <a href="https://explorer.hiro.so/" target="_blank" rel="noopener noreferrer" className="hover:text-stacks-orange-light transition-colors">Stacks Explorer</a>
              <span className="text-border">|</span>
              <span>Built on Bitcoin via Stacks</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
