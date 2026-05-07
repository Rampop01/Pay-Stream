# ContentStream - Decentralized Content Marketplace on Stacks

A production-ready decentralized content monetization platform leveraging Clarity smart contracts and the Stacks blockchain for secure, on-chain purchases and STX royalties.

## Features

- **On-Chain Metadata**: Register your content metadata directly in the ContentHub smart contract.
- **Direct Monetization**: Audiences unlock content by interacting with the smart contract, ensuring trustless royalty payments.
- **Verified Earnings**: Successful unlocks are recorded on-chain, building a verifiable creator history.
- **Stacks Native**: Built on the Stacks blockchain, inheriting Bitcoin's security for every transaction.
- **Modern UI**: A premium, responsive interface designed with Tailwind CSS and Framer Motion.

## Tech Stack

### Core
- **Clarity** - Predictable smart contracts for talent registration and hiring
- **Next.js 16** with App Router and TypeScript
- **React 19** with React Hook Form and Zod
- **Tailwind CSS 3.4** for styling
- **shadcn/ui** for UI components

### Stacks Integration
- **@stacks/transactions** - For crafting on-chain contract calls
- **@stacks/connect** - Wallet connection and interaction (Leather, Xverse)
- **Zustand** - State management for wallet session

## Smart Contract

The core logic resides in `contracts/content-hub.clar`. It manages:
- **Metadata Registration**: Storing titles, descriptions, and pricing on-chain.
- **Unlocking Logic**: Handling STX transfers from buyers to creators.
- **Sales Tracking**: Counting successful unlocks per creation.

## Getting Started

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd content-stream
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### The Monetization Flow

```
1. Creator connects wallet and registers content (Contract Call)
   ↓
2. Audience browses creations on the ContentStream explorer
   ↓
3. Audience clicks "Unlock" on a specific content piece
   ↓
4. Audience signs a contract call (unlock-content) via Leather/Xverse
   ↓
5. STX is transferred from Buyer to Creator on the Stacks blockchain
   ↓
6. Content's "Total Unlocks" count increases on-chain
   ↓
7. The purchase record is indexed for creator history
```

## Project Structure

```
/app
├── page.tsx                 # Landing page
├── /explore/page.tsx        # Content discovery
├── /create/page.tsx         # Upload content page
├── /content/[id]/page.tsx   # Content detail & unlocking
├── /api/content             # Indexing API for on-chain data
└── /layout.tsx              # Root layout with premium theme

/components
├── Navbar.tsx               # Navigation with wallet status
├── ContentCard.tsx          # Content preview card
├── CreateContentForm.tsx    # On-chain registration form
└── /ui/*                    # shadcn/ui components

/contracts
└── content-hub.clar         # Clarity smart contract

/lib
├── contract.ts              # Contract interaction layer
├── types.ts                 # TypeScript interfaces
├── store.ts                 # Zustand wallet store
└── db.ts                    # Local indexing database
```

## Deployment

### Smart Contract
Deploy `contracts/content-hub.clar` to Stacks Testnet or Mainnet using Hiro Explorer or Clarinet.

### Frontend
Deploy to [Vercel](https://vercel.com):
```bash
vercel deploy
```

---

Built with love for the Stacks ecosystem.
