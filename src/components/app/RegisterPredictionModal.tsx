import React, { useState } from 'react';
import { X, Send, AlertCircle, Info, Globe, Clock } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { executeRegisterPrediction, waitForReceiptWithProgress } from '../../services/contractService';
import { ALLOWED_DOMAINS, MIN_LEAD_SECONDS } from '../../config/chain';

interface RegisterPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (predictionId: string) => void;
  onStartProgress: (title: string) => void;
  onUpdateProgress: (
    stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error',
    elapsed: number,
    txHash?: string,
    error?: string
  ) => void;
}

export const RegisterPredictionModal: React.FC<RegisterPredictionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onStartProgress,
  onUpdateProgress,
}) => {
  const { account, writeClient } = useWallet();

  const minDate = new Date(Date.now() + (MIN_LEAD_SECONDS + 60) * 1000);
  const minDateStr = minDate.toISOString().slice(0, 16);

  const [eventText, setEventText] = useState('');
  const [probBp, setProbBp] = useState<number>(7500);
  const [resolveAfterLocal, setResolveAfterLocal] = useState(minDateStr);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateUrlClient = (rawUrl: string): string => {
    const clean = rawUrl.trim();
    if (!clean) throw new Error('Source URL cannot be empty.');
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

    const trimmedEvent = eventText.trim();
    if (!trimmedEvent) {
      setError('Event text cannot be empty.');
      return;
    }
    if (trimmedEvent.length > 300) {
      setError('Event text exceeds 300 characters limit.');
      return;
    }
    if (probBp < 1 || probBp > 9999) {
      setError('Probability must be between 1 and 9999 basis points.');
      return;
    }

    let validatedUrl = '';
    try {
      validatedUrl = validateUrlClient(sourceUrl);
    } catch (urlErr: any) {
      setError(urlErr.message);
      return;
    }

    const selectedDate = new Date(resolveAfterLocal);
    const nowMs = Date.now();
    if (selectedDate.getTime() < nowMs + MIN_LEAD_SECONDS * 1000) {
      setError(`Resolve deadline must be at least ${MIN_LEAD_SECONDS} seconds in the future.`);
      return;
    }

    const resolveAfterUtc = selectedDate.toISOString().replace(/\.\d{3}Z$/, 'Z');

    setError(null);
    setIsSubmitting(true);
    onClose();
    onStartProgress('Registering Prediction on Studionet');

    try {
      onUpdateProgress('submitting', 0);
      const txHash = await executeRegisterPrediction(
        writeClient,
        trimmedEvent,
        probBp,
        resolveAfterUtc,
        validatedUrl
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#14151a] border border-[#2b2d35] rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2d35] bg-[#1a1b22]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d98c4f] animate-pulse" />
            <h3 className="text-base sm:text-lg font-semibold text-white tracking-wide">
              REGISTER NEW PREDICTION
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-[#ad355b]/10 border border-[#ad355b]/40 rounded-lg text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 text-[#ad355b] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Event Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Event Description (Max 300 chars)
            </label>
            <textarea
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="e.g. Did the Federal Open Market Committee lower the target range for federal funds rate by 25 basis points?"
              maxLength={300}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[#0b0c0e] border border-[#2b2d35] rounded-lg text-white placeholder-slate-500 text-base focus:outline-none focus:border-[#9d4f72] transition-colors resize-none"
              required
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Be specific and binary (settles YES or NO)</span>
              <span>{eventText.length}/300</span>
            </div>
          </div>

          {/* Probability Slider */}
          <div className="space-y-2 p-4 bg-[#1a1b22] border border-[#2b2d35] rounded-lg">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Assessed Probability
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-mono text-[#d98c4f]">
                  {(probBp / 100).toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400 font-mono">({probBp} bp)</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="9999"
              step="50"
              value={probBp}
              onChange={(e) => setProbBp(Number(e.target.value))}
              className="w-full h-2 bg-[#0b0c0e] rounded-lg appearance-none cursor-pointer accent-[#d98c4f]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>0.01% (Unlikely)</span>
              <span>50.00% (Neutral)</span>
              <span>99.99% (Certain)</span>
            </div>
          </div>

          {/* Resolution Timing & Source URL */}
          <div className="grid grid-cols-1 gap-4">
            {/* Resolve After */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#d98c4f]" />
                Resolve Deadline (ISO-8601 UTC)
              </label>
              <input
                type="datetime-local"
                min={minDateStr}
                value={resolveAfterLocal}
                onChange={(e) => setResolveAfterLocal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0c0e] border border-[#2b2d35] rounded-lg text-white text-base focus:outline-none focus:border-[#9d4f72] transition-colors"
                required
              />
              <p className="text-[11px] text-slate-400">
                Enforced by contract: must be at least {MIN_LEAD_SECONDS}s in the future.
              </p>
            </div>

            {/* Committed Source URL */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-[#9d4f72]" />
                Committed Resolution Source URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://raw.githubusercontent.com/... or https://reuters.com/..."
                className="w-full px-3.5 py-2.5 bg-[#0b0c0e] border border-[#2b2d35] rounded-lg text-white text-base focus:outline-none focus:border-[#9d4f72] transition-colors"
                required
              />
              <div className="p-2.5 bg-[#0b0c0e] border border-[#2b2d35] rounded-md text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 uppercase tracking-wider block">
                  Authorized Domain Allowlist:
                </span>
                <p className="font-mono text-slate-400 leading-relaxed">
                  {ALLOWED_DOMAINS.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Zero Capital Info Banner */}
          <div className="flex items-start gap-3 p-3.5 bg-[#9d4f72]/10 border border-[#9d4f72]/30 rounded-lg text-slate-300 text-xs">
            <Info className="w-4 h-4 text-[#9d4f72] shrink-0 mt-0.5" />
            <span>
              <strong>Zero Capital At Risk:</strong> Predictions require no token stake. Only calibration reputation is evaluated on-chain via quadratic Brier score.
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !account}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#d98c4f] hover:bg-[#b8632e] disabled:opacity-50 text-white text-base font-semibold rounded-lg shadow-lg shadow-[#d98c4f]/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Prediction on Studionet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
