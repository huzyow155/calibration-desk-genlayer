import React from 'react';
import { Target, ExternalLink, Wallet, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import {
  CALIBRATION_LEDGER_ADDRESS,
  STUDIONET_EXPLORER_URL,
} from '../../config/chain';

interface NavbarProps {
  currentView: 'landing' | 'app';
  onNavigate: (view: 'landing' | 'app') => void;
  onOpenWalletModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenWalletModal,
}) => {
  const { account, isConnecting } = useWallet();

  const shortAccount = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#0b0c0e]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
        {/* Brand */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white shadow-md shadow-black/40 transition-transform group-hover:scale-105">
            <Target className="h-5 w-5 text-stone-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white sm:text-lg">
                CalibrationDesk
              </span>
              <span className="rounded border border-stone-700 bg-stone-900/80 px-1.5 py-0.5 text-[10px] font-mono text-stone-400">
                PREVIEW
              </span>
            </div>
            <p className="text-[11px] font-mono text-stone-400 hidden sm:block">
              GENLAYER STUDIONET // BRIER SCORE LEDGER
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          <button
            onClick={() => onNavigate('landing')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('app')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              currentView === 'app'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Workbench
          </button>
        </nav>

        {/* Right actions: Contract Link + Wallet */}
        <div className="flex items-center gap-3">
          <a
            href={`${STUDIONET_EXPLORER_URL}/address/${CALIBRATION_LEDGER_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-stone-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>Contract</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={onOpenWalletModal}
            disabled={isConnecting}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              account
                ? 'border border-[#d98c4f]/40 bg-[#d98c4f]/20 text-[#fed7aa] hover:bg-[#d98c4f]/30'
                : 'bg-white text-stone-950 hover:bg-stone-200'
            }`}
          >
            {account ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#d98c4f]" />
                <span className="font-mono">{shortAccount}</span>
              </>
            ) : (
              <>
                <Wallet className="h-3.5 w-3.5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
