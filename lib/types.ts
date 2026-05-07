// Core content data model for ContentStream
export type ContentCategory = 'Video' | 'Art' | 'Music' | 'Education' | 'Other';

export interface Content {
  id: string;
  title: string;
  description: string;
  embedUrl: string; // URL for the content (YouTube, Vimeo, etc.)
  thumbnailUrl: string;
  category: ContentCategory;
  priceInSTX: number; // Price in STX to unlock
  creatorAddress: string;
  creatorName: string;
  createdAt: number;
  totalUnlocks: number;
}

// Purchase record stored after successful transactions
export interface PurchaseRecord {
  contentId: string;
  buyerAddress: string;
  txId: string;
  amount: string; // microSTX
  timestamp: number;
}

// Wallet state for the store
export interface WalletState {
  address: string | null;
  network: 'mainnet' | 'testnet';
  setAddress: (address: string) => void;
  clearWallet: () => void;
}
