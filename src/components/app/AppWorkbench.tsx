import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Shield,
  RefreshCw,
  Eye,
  Wallet,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import {
  CALIBRATION_LEDGER_ADDRESS,
  STUDIONET_EXPLORER_URL,
  DEMO_FORECASTER_A,
  DEMO_FORECASTER_B,
} from '../../config/chain';
import {
  fetchCalibrationReport,
  fetchPrediction,
  fetchPredictionsByForecaster,
} from '../../services/contractService';
import type { PredictionRecord, CalibrationReport } from '../../types/prediction';
import { DecileHistogram } from './DecileHistogram';
import { RegisterPredictionModal } from './RegisterPredictionModal';
import { ResolveEventModal } from './ResolveEventModal';
import { CouncilEndorsementSection } from './CouncilEndorsementSection';
import { WaitingStateModal } from '../common/WaitingStateModal';

export const AppWorkbench: React.FC = () => {
  const { account } = useWallet();

  // Active address being inspected (defaults to Forecaster A)
  const [selectedProfile, setSelectedProfile] = useState<'A' | 'B' | 'wallet' | 'custom'>('A');
  const [targetAddress, setTargetAddress] = useState<string>(DEMO_FORECASTER_A.address);
  const [customInput, setCustomInput] = useState<string>('');

  // Loaded data
  const [report, setReport] = useState<CalibrationReport | null>(null);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedForResolve, setSelectedForResolve] = useState<PredictionRecord | null>(null);
  const [inspectPrediction, setInspectPrediction] = useState<PredictionRecord | null>(null);

  // Progress state
  const [progressModal, setProgressModal] = useState<{
    isOpen: boolean;
    title: string;
    stage: 'submitting' | 'consensus' | 'reading' | 'success' | 'error';
    elapsedSec: number;
    txHash?: string;
    errorMessage?: string;
  }>({
    isOpen: false,
    title: '',
    stage: 'submitting',
    elapsedSec: 0,
  });

  // Load forecaster report and predictions
  const loadForecasterData = useCallback(async (address: string) => {
    setIsLoading(true);
    try {
      const rep = await fetchCalibrationReport(address);
      setReport(rep);

      const pids = await fetchPredictionsByForecaster(address, 20);
      const fetchedRecords: PredictionRecord[] = [];

      for (const pid of pids) {
        const rec = await fetchPrediction(pid);
        if (rec) fetchedRecords.push(rec);
      }

      setPredictions(fetchedRecords);
    } catch (err) {
      console.error('Failed to load forecaster data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecasterData(targetAddress);
  }, [targetAddress, loadForecasterData]);

  // Switch profile handler
  const handleSelectProfile = (profile: 'A' | 'B' | 'wallet' | 'custom') => {
    setSelectedProfile(profile);
    if (profile === 'A') {
      setTargetAddress(DEMO_FORECASTER_A.address);
    } else if (profile === 'B') {
      setTargetAddress(DEMO_FORECASTER_B.address);
    } else if (profile === 'wallet' && account) {
      setTargetAddress(account);
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim().startsWith('0x')) {
      setSelectedProfile('custom');
      setTargetAddress(customInput.trim());
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header & Zero-GEN Guidance Notice */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
                CALIBRATION WORKBENCH // GENLAYER STUDIONET
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Forecaster Evaluation Desk
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-stone-200 transition-colors shadow-lg cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Forecast</span>
              </button>
            </div>
          </div>

          {/* Zero-GEN Guidance Notice Banner (Violet Accent - Informational/Neutral) */}
          <div className="rounded-2xl border border-[#9d4f72]/30 bg-[#9d4f72]/15 p-5 text-stone-200 leading-relaxed flex items-start gap-4 shadow-sm">
            <Shield className="h-5 w-5 text-[#9d4f72] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-[#f5d0fe] block text-base">
                Zero-GEN Forecasting Guarantee
              </span>
              <p className="text-sm text-stone-300 leading-relaxed font-normal">
                CalibrationLedger holds no funds and requires no financial stake. Forecasters register beliefs
                in basis points (1 to 9999 bp) and resolutions are graded on real-world evidence.
                Studionet validators subsidize gas, and all transactions carry zero token value.
              </p>
            </div>
          </div>
        </section>

        {/* Forecaster Profile Selector (Persistent No-Wallet Demo Data) */}
        <section className="rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Select Forecaster Profile</h2>
              <p className="text-sm text-stone-400 font-light mt-0.5">
                Browse persistent on-chain predictions without connecting a wallet, or inspect your own address.
              </p>
            </div>

            <button
              onClick={() => loadForecasterData(targetAddress)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh State</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Forecaster A - Rose Accent (The Trap Case) */}
            <button
              onClick={() => handleSelectProfile('A')}
              className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                selectedProfile === 'A'
                  ? 'border-[#ad355b]/70 bg-[#ad355b]/20 shadow-md'
                  : 'border-white/8 bg-black/30 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Forecaster A</span>
                <span className="rounded bg-[#ad355b]/30 border border-[#ad355b]/50 px-2 py-0.5 text-[11px] font-mono text-[#ffb3c6]">
                  THE TRAP CASE
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-400 font-light leading-snug">
                Overconfident 9900 bp prediction that failed. Brier score severely penalized to 0.49505.
              </p>
            </button>

            {/* Forecaster B - Amber Accent (Well-Calibrated) */}
            <button
              onClick={() => handleSelectProfile('B')}
              className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                selectedProfile === 'B'
                  ? 'border-[#d98c4f]/70 bg-[#d98c4f]/20 shadow-md'
                  : 'border-white/8 bg-black/30 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">Forecaster B</span>
                <span className="rounded bg-[#d98c4f]/30 border border-[#d98c4f]/50 px-2 py-0.5 text-[11px] font-mono text-[#fed7aa]">
                  WELL-CALIBRATED
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-400 font-light leading-snug">
                Calibrated probabilities (1000 bp on NO, 8500 bp on YES). Pristine Brier score 0.01625.
              </p>
            </button>

            {/* My Connected Wallet - Violet Accent */}
            <button
              onClick={() => handleSelectProfile('wallet')}
              disabled={!account}
              className={`rounded-xl border p-4 text-left transition-all ${
                !account
                  ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/20'
                  : selectedProfile === 'wallet'
                  ? 'border-[#9d4f72]/70 bg-[#9d4f72]/20 shadow-md cursor-pointer'
                  : 'border-white/8 bg-black/30 hover:border-white/20 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white text-sm">My Connected Wallet</span>
                <Wallet className={`h-4 w-4 ${selectedProfile === 'wallet' ? 'text-[#f5d0fe]' : 'text-stone-400'}`} />
              </div>
              <p className="mt-2 text-sm text-stone-400 font-light leading-snug">
                {account ? `${account.slice(0, 10)}...${account.slice(-4)}` : 'Connect wallet to view personal forecasts'}
              </p>
            </button>
          </div>

          {/* Search by custom address */}
          <form onSubmit={handleCustomSearch} className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-500" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Query any forecaster hex address: 0x..."
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-600 focus:border-[#9d4f72]/50 focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Lookup
            </button>
          </form>
        </section>

        {/* Calibration Report & 10-Decile Curve */}
        {report && (
          <section className="space-y-6">
            <DecileHistogram
              buckets={report.buckets || []}
              brierScore={report.brier_score}
              forecaster={targetAddress}
            />
          </section>
        )}

        {/* On-Chain Predictions History Table */}
        <section className="rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
                ON-CHAIN FORECAST LEDGER
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Recorded Predictions ({predictions.length})
              </h3>
            </div>

            <div className="text-[11px] font-mono text-stone-400">
              TARGET ADDRESS: {targetAddress.slice(0, 10)}...{targetAddress.slice(-4)}
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-stone-500 font-mono">
              Loading on-chain records from GenLayer Studionet...
            </div>
          ) : predictions.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              No registered predictions found for this address.
            </div>
          ) : (
            <div className="space-y-3">
              {predictions.map((p) => {
                const probPct = (p.prob_bp / 100).toFixed(2);
                const isTrap = p.prob_bp >= 9900 && p.outcome === 'NO';

                return (
                  <div
                    key={p.prediction_id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/40 p-4 hover:border-white/20 transition-all"
                  >
                    {/* Left: ID & Question */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        {/* Prediction ID with Violet Accent */}
                        <span className="font-mono text-xs font-bold text-[#f5d0fe]">
                          #{p.prediction_id}
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">
                          ROUND {p.created_at_round}
                        </span>
                        {isTrap && (
                          <span className="rounded bg-[#8c1320]/40 border border-[#ad355b]/50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ffb3c6]">
                            TRAP PENALTY CASE
                          </span>
                        )}
                      </div>
                      <p className="text-base font-semibold text-white leading-snug">
                        {p.event_text}
                      </p>
                    </div>

                    {/* Middle: Stated Probability & Status */}
                    <div className="flex items-center gap-6 text-xs font-mono">
                      <div>
                        <span className="text-stone-400 block text-[11px]">PROBABILITY</span>
                        <span className="font-bold text-white text-sm">{probPct}%</span>
                        <span className="text-stone-400 text-[11px]"> ({p.prob_bp} bp)</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">OUTCOME</span>
                        {p.status === 'RESOLVED' ? (
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-sm ${
                              p.outcome === 'YES'
                                ? 'text-[#d98c4f]'
                                : p.outcome === 'NO'
                                ? 'text-[#ad355b]'
                                : 'text-stone-400'
                            }`}
                          >
                            {p.outcome}
                          </span>
                        ) : (
                          <span className="text-[#f5d0fe] font-semibold text-sm">OPEN</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 pt-2 md:pt-0">
                      <button
                        onClick={() => setInspectPrediction(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-stone-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>

                      {p.status === 'OPEN' && (
                        <button
                          onClick={() => setSelectedForResolve(p)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#d98c4f] hover:bg-[#b8632e] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Downstream Consumer Integration (CalibratedCouncil) */}
        <section>
          <CouncilEndorsementSection
            report={report}
            onStartProgress={(title) => {
              setProgressModal({
                isOpen: true,
                title,
                stage: 'submitting',
                elapsedSec: 0,
              });
            }}
            onUpdateProgress={(stage, elapsed, txHash, error) => {
              setProgressModal((prev) => ({
                ...prev,
                stage,
                elapsedSec: elapsed,
                txHash,
                errorMessage: error,
              }));
            }}
            onSuccess={() => loadForecasterData(targetAddress)}
          />
        </section>
      </div>

      {/* Modals */}
      <RegisterPredictionModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          setIsRegisterOpen(false);
          loadForecasterData(targetAddress);
        }}
        onStartProgress={(title) => {
          setProgressModal({
            isOpen: true,
            title,
            stage: 'submitting',
            elapsedSec: 0,
          });
        }}
        onUpdateProgress={(stage, elapsed, txHash, error) => {
          setProgressModal((prev) => ({
            ...prev,
            stage,
            elapsedSec: elapsed,
            txHash,
            errorMessage: error,
          }));
        }}
      />

      <ResolveEventModal
        isOpen={Boolean(selectedForResolve)}
        onClose={() => setSelectedForResolve(null)}
        prediction={selectedForResolve}
        onSuccess={() => {
          setSelectedForResolve(null);
          loadForecasterData(targetAddress);
        }}
        onStartProgress={(title) => {
          setProgressModal({
            isOpen: true,
            title,
            stage: 'submitting',
            elapsedSec: 0,
          });
        }}
        onUpdateProgress={(stage, elapsed, txHash, error) => {
          setProgressModal((prev) => ({
            ...prev,
            stage,
            elapsedSec: elapsed,
            txHash,
            errorMessage: error,
          }));
        }}
      />

      {/* Deep Inspection Modal */}
      {inspectPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#121418] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
                  PREDICTION AUDIT DETAILS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Record #{inspectPrediction.prediction_id}
                </h3>
              </div>
              <button
                onClick={() => setInspectPrediction(null)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-white/8 bg-black/40 p-3.5 space-y-1">
                <span className="text-[11px] font-mono text-stone-400 uppercase">EVENT TEXT</span>
                <p className="text-base font-semibold text-white leading-snug">{inspectPrediction.event_text}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/8 bg-black/40 p-3 font-mono">
                  <span className="text-[11px] text-stone-400 uppercase block">STATED CONFIDENCE</span>
                  <span className="text-sm font-bold text-[#d98c4f]">
                    {(inspectPrediction.prob_bp / 100).toFixed(2)}%
                  </span>
                  <span className="text-stone-400 text-[11px]"> ({inspectPrediction.prob_bp} bp)</span>
                </div>

                <div className="rounded-xl border border-white/8 bg-black/40 p-3 font-mono">
                  <span className="text-[11px] text-stone-400 uppercase block">OUTCOME</span>
                  <span className={`text-sm font-bold ${
                    inspectPrediction.outcome === 'YES'
                      ? 'text-[#d98c4f]'
                      : inspectPrediction.outcome === 'NO'
                      ? 'text-[#ad355b]'
                      : 'text-white'
                  }`}>
                    {inspectPrediction.outcome || 'OPEN'}
                  </span>
                </div>
              </div>

              {inspectPrediction.resolution_evidence && (
                <div className="rounded-xl border border-white/8 bg-black/40 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>EVIDENCE TEXT</span>
                    <span className="text-[#d98c4f]">QUOTE: {inspectPrediction.resolution_quote}</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed font-light text-sm">
                    "{inspectPrediction.resolution_evidence}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Waiting State Modal */}
      <WaitingStateModal
        isOpen={progressModal.isOpen}
        title={progressModal.title}
        stage={progressModal.stage}
        elapsedSec={progressModal.elapsedSec}
        txHash={progressModal.txHash}
        errorMessage={progressModal.errorMessage}
        onClose={() => setProgressModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
