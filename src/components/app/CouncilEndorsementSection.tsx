import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { executeCouncilEndorse, waitForReceiptWithProgress } from '../../services/contractService';
import { CALIBRATED_COUNCIL_ADDRESS, STUDIONET_EXPLORER_URL } from '../../config/chain';
import type { CalibrationReport } from '../../types/prediction';

interface CouncilEndorsementSectionProps {
  report: CalibrationReport | null;
  onStartProgress: (title: string) => void;
  onUpdateProgress: (stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error', elapsed: number, txHash?: string, error?: string) => void;
  onSuccess: () => void;
}

export const CouncilEndorsementSection: React.FC<CouncilEndorsementSectionProps> = ({
  report,
  onStartProgress,
  onUpdateProgress,
  onSuccess,
}) => {
  const { account, writeClient } = useWallet();
  const [statement, setStatement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nScored = report?.n_scored ?? 0;
  const brier = report?.brier_score ?? null;
  const isEligible = nScored >= 2 && brier !== null && brier <= 0.15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeClient || !account) {
      setError('Please connect your wallet first.');
      return;
    }
    const trimmed = statement.trim();
    if (trimmed.length < 10 || trimmed.length > 250) {
      setError('Policy statement must be between 10 and 250 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    onStartProgress('Endorsing Policy on Calibrated Council');

    try {
      onUpdateProgress('submitting', 0);
      const txHash = await executeCouncilEndorse(writeClient, trimmed);
      onUpdateProgress('consensus', 0, txHash);

      const { receipt, success, durationSec } = await waitForReceiptWithProgress(
        writeClient,
        txHash,
        (elapsed) => onUpdateProgress('consensus', elapsed, txHash)
      );

      if (!success) {
        throw new Error(`Consensus failed: ${receipt?.status_name}`);
      }

      onUpdateProgress('success', durationSec, txHash);
      setStatement('');
      onSuccess();
    } catch (err: any) {
      console.error('Council endorsement error:', err);
      onUpdateProgress('error', 0, undefined, err.message || 'Transaction reverted');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              DOWNSTREAM CONSUMER INTEGRATION
            </span>
            <span className="rounded bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 text-[10px] font-mono text-sky-300">
              CONSUMER CONTRACT
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">
            CalibratedCouncil Governance Gating
          </h3>
        </div>

        <a
          href={`${STUDIONET_EXPLORER_URL}/address/${CALIBRATED_COUNCIL_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-stone-400 hover:text-white transition-colors"
        >
          {CALIBRATED_COUNCIL_ADDRESS.slice(0, 10)}...{CALIBRATED_COUNCIL_ADDRESS.slice(-4)}
        </a>
      </div>

      <p className="text-xs sm:text-sm text-stone-300/85 leading-relaxed font-light">
        The CalibratedCouncil smart contract performs a direct cross-contract query to CalibrationLedger.
        Only forecasters with at least <strong>2 scored predictions</strong> and a verified <strong>Brier score &le; 0.1500</strong>{' '}
        can endorse high-stakes policy recommendations.
      </p>

      {/* Qualification Badge */}
      <div className={`rounded-xl border p-4 flex items-start gap-3.5 ${isEligible ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200' : 'border-amber-500/20 bg-amber-950/20 text-amber-200'}`}>
        {isEligible ? (
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-sm">
            {isEligible
              ? 'Council Membership Eligible (Brier Score Qualified)'
              : 'Council Gating Requirement Not Met'}
          </div>
          <div className="text-stone-300">
            Current Profile: {nScored} scored events | Brier Score:{' '}
            <span className="font-mono font-bold">
              {brier !== null && brier !== undefined ? brier.toFixed(5) : 'Unscored'}
            </span>{' '}
            (Requirement: &le; 0.1500 with &ge; 2 scored events).
          </div>
        </div>
      </div>

      {/* Policy Endorsement Form */}
      {isEligible && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300">
              Submit Endorsed Policy Recommendation
            </label>
            <input
              type="text"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. Recommend maintaining 25% reserve liquidity buffer for upcoming quarter."
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder-stone-600 focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-mono">
              Error: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !statement.trim()}
            className="rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-stone-950 hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-2"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Endorse Policy via Consumer Contract</span>
          </button>
        </form>
      )}
    </div>
  );
};
