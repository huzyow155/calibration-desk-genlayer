import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Send, ExternalLink } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import {
  CALIBRATED_COUNCIL_ADDRESS,
  STUDIONET_EXPLORER_URL,
} from '../../config/chain';
import {
  executeCouncilEndorse,
  waitForReceiptWithProgress,
} from '../../services/contractService';
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
    onStartProgress('Endorsing Policy via CalibratedCouncil');

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

      onUpdateProgress('reading', durationSec, txHash);
      onUpdateProgress('success', durationSec, txHash);
      setStatement('');
      onSuccess();
    } catch (err: any) {
      console.error('Policy endorsement error:', err);
      onUpdateProgress('error', 0, undefined, err.message || 'Transaction reverted');
      setError(err.message || 'Endorsement call reverted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
            DOWNSTREAM CONSUMER GOVERNANCE
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            CalibratedCouncil Policy Endorsement
          </h3>
        </div>

        <a
          href={`${STUDIONET_EXPLORER_URL}/address/${CALIBRATED_COUNCIL_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-stone-300 hover:bg-white/10 transition-colors"
        >
          <span>Consumer Contract</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <p className="text-sm text-stone-300 leading-relaxed font-normal">
        The CalibratedCouncil smart contract performs a direct cross-contract query to CalibrationLedger.
        Only forecasters with at least <strong>2 scored predictions</strong> and a verified <strong>Brier score &le; 0.1500</strong>{' '}
        can endorse high-stakes policy recommendations.
      </p>

      {/* Qualification Badge */}
      <div
        className={`rounded-xl border p-4 flex items-start gap-3.5 ${
          isEligible
            ? 'border-[#d98c4f]/40 bg-[#d98c4f]/15 text-[#fed7aa]'
            : 'border-[#ad355b]/40 bg-[#ad355b]/15 text-[#ffb3c6]'
        }`}
      >
        {isEligible ? (
          <ShieldCheck className="h-5 w-5 text-[#d98c4f] shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-[#ad355b] shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-sm">
            {isEligible
              ? 'Council Membership Eligible (Brier Score Qualified)'
              : 'Council Gating Requirement Not Met'}
          </div>
          <div className="text-stone-300 text-xs">
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
            <label className="text-sm font-semibold text-stone-300">
              Submit Endorsed Policy Recommendation
            </label>
            <input
              type="text"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="e.g. Recommend maintaining 25% reserve liquidity buffer for upcoming quarter."
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-base text-white placeholder-stone-600 focus:border-[#9d4f72]/50 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-[#ad355b] font-mono">
              Error: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !statement.trim()}
            className="rounded-xl bg-[#d98c4f] hover:bg-[#b8632e] px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Send className="h-4 w-4" />
            <span>Endorse Policy via Consumer Contract</span>
          </button>
        </form>
      )}
    </div>
  );
};
