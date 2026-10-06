import React from 'react';
import { X, Wallet, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { STUDIONET_NAME } from '../../config/chain';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const {
    account,
    isConnecting,
    discoveredWallets,
    connectWallet,
    disconnectWallet,
    isCorrectNetwork,
    switchNetwork,
  } = useWallet();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121418] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-stone-300" />
            <h3 className="text-lg font-bold text-white">
              {account ? 'Connected Wallet' : 'Connect Web3 Wallet'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Zero-GEN Notice */}
        <div className="rounded-xl border border-sky-500/20 bg-sky-950/20 p-4 text-xs text-sky-200/90 leading-relaxed space-y-1">
          <div className="font-semibold text-sky-300 flex items-center gap-1.5">
            <span>Zero-GEN Required</span>
          </div>
          <p>
            Transactions on CalibrationLedger do not require funds or token staking. Studionet provides free
            validator consensus for registered forecasts.
          </p>
        </div>

        {/* Connected state */}
        {account ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
              <div className="text-[11px] font-mono text-stone-400 uppercase">
                Active Address
              </div>
              <div className="font-mono text-sm text-emerald-400 break-all select-all">
                {account}
              </div>
            </div>

            {!isCorrectNetwork && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-2 text-xs text-amber-200">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>Network Mismatch</span>
                </div>
                <p>Please switch your connected wallet network to {STUDIONET_NAME}.</p>
                <button
                  onClick={switchNetwork}
                  className="w-full mt-2 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-black hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Switch to Studionet
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  disconnectWallet();
                  onClose();
                }}
                className="flex-1 rounded-xl border border-rose-500/20 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-colors cursor-pointer"
              >
                Disconnect
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Disconnected State - Provider List */
          <div className="space-y-3">
            <p className="text-xs text-stone-400">
              Select an injected or EIP-6963 provider to sign forecast registrations and resolutions:
            </p>

            <div className="space-y-2">
              {discoveredWallets.length > 0 ? (
                discoveredWallets.map((wallet) => (
                  <button
                    key={wallet.info.uuid}
                    disabled={isConnecting}
                    onClick={() => {
                      connectWallet(wallet);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      {wallet.info.icon ? (
                        <img
                          src={wallet.info.icon}
                          alt={wallet.info.name}
                          className="h-6 w-6 rounded-md"
                        />
                      ) : (
                        <Wallet className="h-6 w-6 text-stone-300" />
                      )}
                      <span className="text-sm font-semibold text-white">
                        {wallet.info.name}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 font-mono">EIP-6963</span>
                  </button>
                ))
              ) : (
                <button
                  disabled={isConnecting}
                  onClick={() => {
                    connectWallet();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-stone-300" />
                    <span className="text-sm font-semibold text-white">
                      Injected Web3 Wallet (MetaMask / Rabby)
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">DEFAULT</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
