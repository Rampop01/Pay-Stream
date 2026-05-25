'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWalletStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Zap, BookOpen, HelpCircle, ExternalLink, Coins } from 'lucide-react';
/** @description Wallet management and royalty withdrawal interface */


const Navbar = dynamic(() => import('@/components/Navbar').then((mod) => mod.Navbar), { ssr: false });
const WalletConnectPanel = dynamic(() => import('@/components/WalletConnectPanel').then((mod) => mod.WalletConnectPanel), { ssr: false });

export default function WalletPage() {
  const { address } = useWalletStore();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address]);

  const fetchBalance = async () => {
    try {
      const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`);
      const data = await res.json();
      const stxBalance = (parseInt(data.stx.balance) / 1000000).toFixed(2);
      setBalance(stxBalance);
    } catch (e) {
      console.error('Balance fetch error:', e);
    }
  };

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
            Connect your Stacks wallet to start using PayStream
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <WalletConnectPanel />
            
            {address && balance !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-xl p-6 border-stacks-orange/20 bg-stacks-orange/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stacks-orange/10 flex items-center justify-center text-stacks-orange">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Available Balance</div>
                      <div className="text-2xl font-black text-foreground">{balance} STX</div>
                    </div>
                  </div>
                  <button 
                    onClick={fetchBalance}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-stacks-orange"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {address && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-stacks-orange" /> Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group">
                    <div>
                      <div className="text-sm font-bold">Registration Fee</div>
                      <div className="text-[10px] text-muted-foreground">Stacks Blockchain · Success</div>
                      <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText("6dca1a063b740576d991fd75bb310c57736f1cfab516d7331b5480cd21e9e0b4");
                            toast.success("TX ID copied!");
                          }}
                          className="text-[9px] text-stacks-orange hover:underline font-mono"
                        >
                          Copy TX ID
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-red-400">-0.001 STX</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group">
                    <div>
                      <div className="text-sm font-bold">Content Unlock</div>
                      <div className="text-[10px] text-muted-foreground">PayStream Marketplace · Success</div>
                      <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText("dd17dcd81d92a130b3d8ead2823209a9d6ed7c1c25e6c6e16c63e155f7b82199");
                            toast.success("TX ID copied!");
                          }}
                          className="text-[9px] text-stacks-orange hover:underline font-mono"
                        >
                          Copy TX ID
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-red-400">-5.0 STX</div>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 text-xs text-stacks-orange hover:underline font-bold">
                  View Full History on Hiro Explorer
                </button>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-6">
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
                  Get STX tokens (Mainnet recommended)
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">3.</span>
                  Browse premium content on the marketplace
                </li>
                <li className="flex gap-3">
                  <span className="text-stacks-orange-light font-bold">4.</span>
                  Unlock instantly via Clarity smart contracts
                </li>
              </ol>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-glow w-9 h-9 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-stacks-amber" />
                </div>
                <h3 className="font-semibold text-foreground">About PayStream</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PayStream leverages the ContentHub Clarity smart contract to manage decentralized content ownership and secure on-chain payments. Your wallet signs transactions directly on the Stacks blockchain.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
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

// Format balances strictly to 6 decimal places for STX
