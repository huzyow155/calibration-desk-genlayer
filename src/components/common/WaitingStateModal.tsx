import React from 'react';
import { Loader2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { STUDIONET_EXPLORER_URL } from '../../config/chain';

interface WaitingStateModalProps {
  isOpen: boolean;
  title: string;
  stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error';
  elapsedSec: number;
  txHash?: string;
  errorMessage?: string;
  onClose?: () => void;
}

export const WaitingStateModal: React.FC<WaitingStateModalProps> = ({
  isOpen,
  title,
  stage,
  elapsedSec,
  txHash,
  errorMessage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121418] p-6 shadow-2xl space-y-6 text-center">
        {/* Status Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner">
          {stage === 'success' ? (
            <CheckCircle2 className="h-8 w-8 text-[#d98c4f]" />
          ) : stage === 'error' ? (
            <AlertCircle className="h-8 w-8 text-[#ad355b]" />
          ) : (
            <Loader2 className="h-8 w-8 text-stone-200 animate-spin" />
          )}
        </div>

        {/* Title & Stage Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-stone-400 font-light">
            {stage === 'submitting' && 'Broadcasting transaction to GenLayer Studionet RPC...'}
            {stage === 'consensus' && (
              <>
                Validators running independent LLM inference and quote verification via Equivalence Principle.
                <span className="block mt-1 font-mono text-stone-300">Elapsed: {elapsedSec}s (Target: ~15-20s)</span>
              </>
            )}
            {stage === 'reading' && 'Transaction accepted by validators! Reading back fresh on-chain state...'}
            {stage === 'success' && 'Transaction completed and state synchronized successfully.'}
            {stage === 'error' && (errorMessage || 'Transaction execution failed.')}
          </p>
        </div>

        {/* Progress Pipeline */}
        {stage !== 'error' && (
          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className={`p-2 rounded-lg border ${stage === 'submitting' ? 'border-[#9d4f72] bg-[#9d4f72]/30 text-[#f5d0fe]' : 'border-white/10 bg-black/40 text-stone-500'}`}>
              1. BROADCAST
            </div>
            <div className={`p-2 rounded-lg border ${stage === 'consensus' ? 'border-[#9d4f72] bg-[#9d4f72]/30 text-[#f5d0fe]' : stage === 'reading' || stage === 'success' ? 'border-[#d98c4f]/40 text-[#fed7aa]' : 'border-white/10 bg-black/40 text-stone-500'}`}>
              2. CONSENSUS
            </div>
            <div className={`p-2 rounded-lg border ${stage === 'reading' || stage === 'success' ? 'border-[#d98c4f] bg-[#d98c4f]/30 text-[#fed7aa]' : 'border-white/10 bg-black/40 text-stone-500'}`}>
              3. VERIFIED
            </div>
          </div>
        )}

        {/* Transaction Link */}
        {txHash && (
          <div className="rounded-xl border border-white/8 bg-black/40 p-3 text-xs text-stone-300 flex items-center justify-between font-mono">
            <span>TX: {txHash.slice(0, 12)}...{txHash.slice(-6)}</span>
            <a
              href={`${STUDIONET_EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#f5d0fe] hover:text-white transition-colors"
            >
              <span>Explorer</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Close button if finished or errored */}
        {(stage === 'success' || stage === 'error') && onClose && (
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
