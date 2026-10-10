import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ShieldAlert, Globe, Clock, ExternalLink } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { executeResolveEvent, waitForReceiptWithProgress } from '../../services/contractService';
import type { PredictionRecord } from '../../types/prediction';

interface ResolveEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionRecord | null;
  onSuccess: (outcome: string) => void;
  onStartProgress: (title: string) => void;
  onUpdateProgress: (
    stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error',
    elapsed: number,
    txHash?: string,
    error?: string
  ) => void;
}

export const ResolveEventModal: React.FC<ResolveEventModalProps> = ({
  isOpen,
  onClose,
  prediction,
  onSuccess,
  onStartProgress,
  onUpdateProgress,
}) => {
  const { account, writeClient } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !prediction) return null;

  const resolveDate = new Date(prediction.resolve_after);
  const isEarly = Date.now() < resolveDate.getTime();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeClient || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    if (isEarly) {
      setError(`Cannot resolve before enforced deadline: ${prediction.resolve_after}`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    onClose();
    onStartProgress(`Resolving Prediction #${prediction.prediction_id}`);

    try {
      onUpdateProgress('submitting', 0);
      const txHash = await executeResolveEvent(writeClient, prediction.prediction_id);

      onUpdateProgress('consensus', 0, txHash);

      const { receipt, success, durationSec } = await waitForReceiptWithProgress(
        writeClient,
        txHash,
        (elapsed) => onUpdateProgress('consensus', elapsed, txHash)
      );

      if (!success) {
        throw new Error(`Consensus failed: ${receipt?.status_name}`);
      }

      onUpdateProgress('reading', durationSec, txHash);

      const payload = receipt?.consensus_data?.leader_receipt?.[0]?.result?.payload?.readable;
      let outcome = 'RESOLVED';
      if (payload) {
        try {
          outcome = JSON.parse(payload);
        } catch {
          outcome = String(payload).replace(/['"]/g, '');
        }
      }

      onUpdateProgress('success', durationSec, txHash);
      onSuccess(outcome);
    } catch (err: any) {
      console.error('Resolution error:', err);
      onUpdateProgress('error', 0, undefined, err.message || 'Transaction reverted');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
              CONTRACT-SIDE SOURCE RETRIEVAL
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Resolve Prediction #{prediction.prediction_id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prediction summary */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>FORECASTER: {prediction.forecaster.slice(0, 8)}...{prediction.forecaster.slice(-6)}</span>
            <span className="font-bold text-[#d98c4f]">
              {(prediction.prob_bp / 100).toFixed(2)}% ({prediction.prob_bp} bp)
            </span>
          </div>
          <p className="text-sm font-medium text-stone-200 leading-relaxed">
            "{prediction.event_text}"
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400 pt-1 border-t border-white/5">
            <Clock className="w-3.5 h-3.5 text-[#d98c4f]" />
            <span>Resolve After: {prediction.resolve_after}</span>
            {isEarly && (
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-sans ml-auto">
                Locked (Not Yet Reached)
              </span>
            )}
          </div>
        </div>

        {/* Committed Source URL Display */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-[#9d4f72]" />
            Committed Authoritative Source
          </label>
          <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between gap-3 text-xs font-mono text-stone-300 break-all">
            <span className="truncate">{prediction.source_url}</span>
            <a
              href={prediction.source_url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 p-1 text-stone-400 hover:text-white transition"
              title="Open source page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-[11px] text-stone-400">
            No self-authored evidence is accepted. The contract retrieves this exact page snapshot autonomously.
          </p>
        </div>

        {/* Verbatim Grounding Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-[#d98c4f]/30 bg-[#d98c4f]/10 p-4 text-xs text-stone-300">
          <ShieldAlert className="w-5 h-5 shrink-0 text-[#d98c4f] mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#d98c4f] block">
              Contract-Side Verbatim Grounding Rule
            </span>
            <p className="text-stone-300 leading-relaxed">
              GenLayer validators independently fetch the committed URL via GenVM web APIs. A valid outcome requires a verbatim quote of at least 12 characters found directly in the retrieved text snapshot. Fetch failure or ambiguous findings leave the prediction in <strong>OPEN</strong> status for subsequent retries.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-[#ad355b]/40 bg-[#ad355b]/10 p-3 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ad355b]" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <form onSubmit={handleSubmit} className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !account || isEarly}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#d98c4f] px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#d98c4f]/25 transition hover:bg-[#b8632e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {isSubmitting
                ? 'Fetching & Resolving...'
                : isEarly
                ? `Locked Until ${prediction.resolve_after}`
                : 'Resolve from Committed Source'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
