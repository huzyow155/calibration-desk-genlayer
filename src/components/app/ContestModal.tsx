import React, { useState } from 'react';
import { X, ShieldAlert, AlertCircle, Globe, Scale } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { executeContestResolution, waitForReceiptWithProgress } from '../../services/contractService';
import { ALLOWED_DOMAINS } from '../../config/chain';
import type { PredictionRecord } from '../../types/prediction';

interface ContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionRecord | null;
  onSuccess: (newOutcome: string) => void;
  onStartProgress: (title: string) => void;
  onUpdateProgress: (
    stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error',
    elapsed: number,
    txHash?: string,
    error?: string
  ) => void;
}

export const ContestModal: React.FC<ContestModalProps> = ({
  isOpen,
  onClose,
  prediction,
  onSuccess,
  onStartProgress,
  onUpdateProgress,
}) => {
  const { account, writeClient } = useWallet();

  const [altSourceUrl, setAltSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !prediction) return null;

  const validateUrlClient = (rawUrl: string): string => {
    const clean = rawUrl.trim();
    if (!clean) return '';
    if (clean.length > 300) throw new Error('Source URL exceeds 300 characters.');
    if (/\s/.test(clean)) throw new Error('Source URL cannot contain whitespace.');

    let parsed: URL;
    try {
      parsed = new URL(clean);
    } catch {
      throw new Error('Invalid URL format.');
    }

    if (parsed.protocol !== 'https:') throw new Error('Source URL scheme must be https://');
    if (!parsed.hostname) throw new Error('Source URL missing hostname.');
    if (parsed.username || parsed.password) throw new Error('Source URL cannot contain userinfo credentials.');
    if (parsed.port && parsed.port !== '443') throw new Error('Source URL port must be 443 or omitted.');
    if (parsed.hash) throw new Error('Source URL cannot contain fragments (#).');

    const host = parsed.hostname.toLowerCase().replace(/\.$/, '');
    if (!/^[\x00-\x7F]+$/.test(host)) throw new Error('Hostname must be pure ASCII.');
    if (host.includes('xn--')) throw new Error('Hostname cannot use punycode.');
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.includes(':')) {
      throw new Error('Hostname cannot be an IP address literal.');
    }

    const matched = ALLOWED_DOMAINS.some(
      (dom) => host === dom || host.endsWith('.' + dom)
    );
    if (!matched) {
      throw new Error(
        `Domain "${host}" is not on the authorized allowlist. Allowed: ${ALLOWED_DOMAINS.join(', ')}`
      );
    }

    return clean;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeClient || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    let validatedAlt = '';
    try {
      validatedAlt = validateUrlClient(altSourceUrl);
    } catch (urlErr: any) {
      setError(urlErr.message);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    onClose();
    onStartProgress(`Contesting Provisional Resolution #${prediction.prediction_id}`);

    try {
      onUpdateProgress('submitting', 0);
      const txHash = await executeContestResolution(
        writeClient,
        prediction.prediction_id,
        validatedAlt
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

      const payload = receipt?.consensus_data?.leader_receipt?.[0]?.result?.payload?.readable;
      let outcome = prediction.outcome || 'RESOLVED';
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
      console.error('Contest error:', err);
      onUpdateProgress('error', 0, undefined, err.message || 'Transaction reverted');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
              ACTIVE CONTEST WINDOW
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Contest Resolution #{prediction.prediction_id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>CURRENT PROVISIONAL OUTCOME:</span>
            <span className="font-bold text-[#ad355b]">{prediction.outcome || 'PROVISIONAL'}</span>
          </div>
          <p className="text-sm font-medium text-stone-200">
            "{prediction.event_text}"
          </p>
          <div className="text-xs font-mono text-stone-400 truncate">
            Committed URL: {prediction.source_url}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#9d4f72]" />
              Optional Alternative Allowlisted URL
            </label>
            <input
              type="url"
              value={altSourceUrl}
              onChange={(e) => setAltSourceUrl(e.target.value)}
              placeholder="Leave blank to re-evaluate committed URL, or enter alternative"
              className="w-full px-3.5 py-2.5 bg-[#0b0c0e] border border-[#2b2d35] rounded-lg text-white text-base focus:outline-none focus:border-[#9d4f72] transition-colors"
            />
            <p className="text-[11px] text-stone-400">
              Must pass the same domain allowlist and structured URL parser.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#ad355b]/30 bg-[#ad355b]/10 p-3.5 text-xs text-stone-300">
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#ad355b] mt-0.5" />
            <p className="leading-relaxed">
              Contestation re-fetches source evidence and triggers a new LLM consensus evaluation. If the fresh grounded outcome differs, the provisional outcome will flip. At most one contest is allowed per prediction.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[#ad355b]/40 bg-[#ad355b]/10 p-3 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#ad355b]" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !account}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ad355b] px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#ad355b]/25 transition hover:bg-[#8c1320] disabled:opacity-50"
          >
            <Scale className="w-5 h-5" />
            <span>{isSubmitting ? 'Contesting...' : 'Submit Resolution Contest'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
