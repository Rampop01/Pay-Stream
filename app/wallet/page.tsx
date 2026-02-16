'use client';

import dynamic from 'next/dynamic';
import { useWalletStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Zap, BookOpen, HelpCircle, ExternalLink } from 'lucide-react';

const Navbar = dynamic(() => import('@/components/Navbar').then((mod) => mod.Navbar), { ssr: false });
const WalletConnectPanel = dynamic(() => import('@/components/WalletConnectPanel').then((mod) => mod.WalletConnectPanel), { ssr: false });

export default function WalletPage() {
  const { address } = useWalletStore();

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      <div className="orb orb-orange w-[400px] h-[400px] -top-32 -right-32 opacity-20" />
      <div className="orb orb-amber w-[300px] h-[300px] bottom-0 -left-24 opacity-15" />

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Wallet <span className="gradient-text-stacks">Connection</span>
          </h1>
          <p className="text-muted-foreground">
            Connect your Leather or Xverse wallet to start using PayStream
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <WalletConnectPanel />


          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card mirror-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-stacks-orange-light" />
                </div>
                <h3 className="font-semibold text-foreground">How It Works</h3>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">1.</span>
                  Connect your Leather or Xverse wallet
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">2.</span>
                  Get testnet STX tokens from the faucet
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">3.</span>
                  Browse content on the marketplace
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">4.</span>
                  Click unlock &mdash; confirm payment in your wallet
                </li>
              </ol>
            </div>

            <div className="glass-card mirror-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-stacks-amber" />
                </div>
                <h3 className="font-semibold text-foreground">About x402-stacks</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PayStream uses the x402-stacks protocol (HTTP 402 Payment Required) to gate premium content behind STX payments. Your wallet signs transactions securely — no private keys stored in the browser.
              </p>
            </div>

            <div className="glass-card mirror-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-stacks-orange" />
                </div>
                <h3 className="font-semibold text-foreground">Resources</h3>
              </div>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://leather.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1.5"
                  >
                    Download Leather Wallet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://explorer.hiro.so/sandbox/faucet?chain=testnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1.5"
                  >
                    Get Testnet STX
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.stacks.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stacks-orange-light hover:text-stacks-amber transition-colors inline-flex items-center gap-1.5"
                  >
                    Stacks Documentation
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
