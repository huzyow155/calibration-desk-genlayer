import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { executeResolveEvent, waitForReceiptWithProgress } from '../../services/contractService';
import type { PredictionRecord } from '../../types/prediction';

interface ResolveEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionRecord | null;
  onSuccess: (outcome: string) => void;
  onStartProgress: (title: string) => void;
  onUpdateProgress: (stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error', elapsed: number, txHash?: string, error?: string) => void;
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

  const [evidenceText, setEvidenceText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !prediction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeClient || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    const trimmedEvidence = evidenceText.trim();
    if (!trimmedEvidence) {
      setError('Evidence text cannot be empty.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    onClose();
    onStartProgress(`Resolving Prediction #${prediction.prediction_id}`);

    try {
      onUpdateProgress('submitting', 0);
      const txHash = await executeResolveEvent(
        writeClient,
        prediction.prediction_id,
        trimmedEvidence
      );

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

      // Outcome extracted from receipt or read-back
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
              CONSENSUS RESOLUTION
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Submit Real-World Evidence</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Prediction Target Details */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-stone-400 font-mono text-[11px]">
            <span className="text-[#f5d0fe]">ID: #{prediction.prediction_id}</span>
            <span>PROBABILITY: {(prediction.prob_bp / 100).toFixed(2)}% ({prediction.prob_bp} bp)</span>
          </div>
          <p className="text-base font-semibold text-white leading-snug">
            "{prediction.event_text}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Evidence Text Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-300">
              Reporting or Press Release Evidence
            </label>
            <textarea
              rows={5}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              placeholder="Paste factual reporting text documenting whether the event occurred or failed..."
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-base text-white placeholder-stone-600 focus:border-[#9d4f72]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Verbatim Grounding Notice (Warm Amber Accent) */}
          <div className="rounded-xl border border-[#d98c4f]/30 bg-[#d98c4f]/15 p-4 text-xs text-[#fed7aa] leading-relaxed flex items-start gap-3">
            <ShieldAlert className="h-4 w-4 text-[#d98c4f] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#fed7aa] block text-sm">Verbatim Grounding Rule</span>
              <p className="text-stone-300 text-xs leading-relaxed font-normal">
                Validators extract an outcome and a verbatim quote. If the quote is shorter than 12 characters
                or does not exist verbatim inside your submitted text, the resolution automatically becomes
                AMBIGUOUS (wash event, excluded from Brier average).
              </p>
            </div>
          </div>

          {/* Error Notice (Rose Accent) */}
          {error && (
            <div className="rounded-xl border border-[#ad355b]/40 bg-[#8c1320]/25 p-3.5 text-xs text-[#ffb3c6] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ad355b]" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-[#d98c4f] hover:bg-[#b8632e] py-3 text-sm font-semibold text-white transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Trigger Consensus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
