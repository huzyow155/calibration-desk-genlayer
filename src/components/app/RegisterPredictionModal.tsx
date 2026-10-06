import React, { useState } from 'react';
import { X, Send, AlertCircle, Info } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { executeRegisterPrediction, waitForReceiptWithProgress } from '../../services/contractService';

interface RegisterPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (predictionId: string) => void;
  onStartProgress: (title: string) => void;
  onUpdateProgress: (stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error', elapsed: number, txHash?: string, error?: string) => void;
}

export const RegisterPredictionModal: React.FC<RegisterPredictionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onStartProgress,
  onUpdateProgress,
}) => {
  const { account, writeClient } = useWallet();

  const [eventText, setEventText] = useState('');
  const [probBp, setProbBp] = useState<number>(7500);
  const [deadlineHint, setDeadlineHint] = useState('2026-12-31');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeClient || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    const trimmed = eventText.trim();
    if (!trimmed) {
      setError('Event text cannot be empty.');
      return;
    }
    if (trimmed.length > 300) {
      setError('Event text exceeds 300 characters limit.');
      return;
    }
    if (probBp < 1 || probBp > 9999) {
      setError('Probability must be between 1 and 9999 basis points.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    onClose();
    onStartProgress('Registering Prediction on Studionet');

    try {
      onUpdateProgress('submitting', 0);
      const txHash = await executeRegisterPrediction(
        writeClient,
        trimmed,
        probBp,
        deadlineHint.trim() || '2026-12-31'
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

      // Extract prediction ID
      const payload = receipt?.consensus_data?.leader_receipt?.[0]?.result?.payload?.readable;
      let pid = '';
      if (payload) {
        try {
          pid = JSON.parse(payload);
        } catch {
          pid = String(payload).replace(/['"]/g, '');
        }
      }

      onUpdateProgress('success', durationSec, txHash);
      onSuccess(pid);
    } catch (err: any) {
      console.error('Registration error:', err);
      onUpdateProgress('error', 0, undefined, err.message || 'Transaction reverted');
    } finally {
      setIsSubmitting(false);
    }
  };

  const probPct = (probBp / 100).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              REGISTER NEW FORECAST
            </span>
            <h3 className="text-xl font-bold text-white">Record Probabilistic Belief</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event description input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-stone-300">
                Future Binary Event Question
              </label>
              <span className={`font-mono ${eventText.length > 300 ? 'text-rose-400' : 'text-stone-500'}`}>
                {eventText.length} / 300
              </span>
            </div>
            <textarea
              rows={3}
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="e.g. Will Artemis II launch astronauts into lunar flyby orbit before end of 2026?"
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-sm text-white placeholder-stone-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>

          {/* Probability slider and number input */}
          <div className="space-y-3 rounded-xl border border-white/8 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300">
                Assigned Probability
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {probPct}%
                </span>
                <span className="text-xs font-mono text-stone-400">
                  ({probBp} bp)
                </span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={9999}
              step={25}
              value={probBp}
              onChange={(e) => setProbBp(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex justify-between text-[10px] font-mono text-stone-500">
              <span>0.01% (1 bp)</span>
              <span>50.00% (5000 bp)</span>
              <span>99.99% (9999 bp)</span>
            </div>

            <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-400">
              <Info className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                Literal 0% and 100% (0 and 10000 bp) are rejected by contract rules.
                Well-calibrated forecasters account for residual uncertainty.
              </span>
            </div>
          </div>

          {/* Deadline hint input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300">
              Resolution Horizon / Deadline Hint
            </label>
            <input
              type="text"
              value={deadlineHint}
              onChange={(e) => setDeadlineHint(e.target.value)}
              placeholder="e.g. 2026-12-31 or Q4 2026"
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder-stone-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-white py-3 text-xs font-semibold text-stone-950 hover:bg-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Register Forecast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
