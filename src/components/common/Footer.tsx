import React from 'react';
import { ExternalLink, GitBranch, Terminal, Shield } from 'lucide-react';
import {
  CALIBRATION_LEDGER_ADDRESS,
  CALIBRATED_COUNCIL_ADDRESS,
  STUDIONET_CHAIN_ID,
  STUDIONET_EXPLORER_URL,
  CONTRACT_REPO_URL,
  DAPP_REPO_URL,
} from '../../config/chain';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/8 bg-[#08090b] py-12 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Mechanism description */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">CalibrationDesk</h4>
            <p className="text-xs leading-relaxed text-stone-400 font-light">
              Autonomous on-chain probability calibration tracking and Brier scoring ledger.
              Built as a pure Intelligent Contract on GenLayer Studionet without financial staking or collateral.
            </p>
          </div>

          {/* Col 2: On-chain contracts */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-semibold text-white">Deployed Contracts</h4>
            <div className="space-y-2 font-mono">
              <div>
                <span className="text-stone-500 block text-[11px]">CALIBRATION LEDGER:</span>
                <a
                  href={`${STUDIONET_EXPLORER_URL}/address/${CALIBRATION_LEDGER_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
                >
                  <span>{CALIBRATION_LEDGER_ADDRESS.slice(0, 14)}...{CALIBRATION_LEDGER_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div>
                <span className="text-stone-500 block text-[11px]">CONSUMER (CALIBRATED COUNCIL):</span>
                <a
                  href={`${STUDIONET_EXPLORER_URL}/address/${CALIBRATED_COUNCIL_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
                >
                  <span>{CALIBRATED_COUNCIL_ADDRESS.slice(0, 14)}...{CALIBRATED_COUNCIL_ADDRESS.slice(-6)}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Repositories & Network */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-semibold text-white">Network & Source</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Network:</span>
                <span className="text-stone-300 font-mono">GenLayer Studionet ({STUDIONET_CHAIN_ID})</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={CONTRACT_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-stone-300 hover:text-white transition-colors"
                >
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>Contract Repo</span>
                </a>
                <a
                  href={DAPP_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-stone-300 hover:text-white transition-colors"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Frontend Repo</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/8 pt-6 text-[11px] text-stone-500">
          <p>
            CalibrationLedger Intelligent Contract // Pure ASCII GenVM Python implementation.
          </p>
          <div className="flex items-center gap-4">
            <span>GenLayer Studionet Preview</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
