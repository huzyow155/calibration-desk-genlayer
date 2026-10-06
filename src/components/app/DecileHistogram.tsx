import React from 'react';
import type { CalibrationBucket } from '../../types/prediction';

interface DecileHistogramProps {
  buckets: CalibrationBucket[];
  brierScore: number | null;
  forecaster: string;
}

export const DecileHistogram: React.FC<DecileHistogramProps> = ({
  buckets,
  brierScore,
  forecaster,
}) => {
  // All 10 standard deciles
  const ALL_DECILES = [
    { range: '0-10', midpoint: 0.05, label: '0-10%' },
    { range: '10-20', midpoint: 0.15, label: '10-20%' },
    { range: '20-30', midpoint: 0.25, label: '20-30%' },
    { range: '30-40', midpoint: 0.35, label: '30-40%' },
    { range: '40-50', midpoint: 0.45, label: '40-50%' },
    { range: '50-60', midpoint: 0.55, label: '50-60%' },
    { range: '60-70', midpoint: 0.65, label: '60-70%' },
    { range: '70-80', midpoint: 0.75, label: '70-80%' },
    { range: '80-90', midpoint: 0.85, label: '80-90%' },
    { range: '90-100', midpoint: 0.95, label: '90-100%' },
  ];

  const bucketMap = new Map<string, CalibrationBucket>();
  buckets.forEach((b) => bucketMap.set(b.range, b));

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121418] p-6 space-y-6">
      {/* Header with Brier Score & Forecaster Address */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
            EMPIRICAL CALIBRATION CURVE
          </span>
          <h4 className="text-lg font-bold text-white">
            10-Decile Confidence Buckets
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-1.5 text-right font-mono">
            <span className="block text-[10px] text-stone-500 uppercase">BRIER SCORE</span>
            <span className={`text-sm font-bold ${brierScore !== null && brierScore < 0.15 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {brierScore !== null ? brierScore.toFixed(5) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Decile Chart Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 h-44 sm:h-52 items-end border-b border-stone-800 pb-2">
          {ALL_DECILES.map((d) => {
            const data = bucketMap.get(d.range);
            const hasData = Boolean(data && data.n > 0);
            const hitRate = data ? data.hit_rate : 0;
            const heightPct = hasData ? Math.max(8, Math.round(hitRate * 100)) : 0;

            // Difference between stated midpoint and empirical hit rate
            const isMisaligned = hasData && Math.abs(hitRate - d.midpoint) > 0.25;

            return (
              <div
                key={d.range}
                className="group relative flex flex-col items-center h-full justify-end"
              >
                {/* Tooltip on hover */}
                {hasData && (
                  <div className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 w-28 rounded-lg border border-white/15 bg-black/90 p-2 text-center text-[10px] text-white shadow-xl">
                    <span className="font-bold text-stone-300">{d.label}</span>
                    <span className="text-emerald-400 font-mono font-semibold">Hit Rate: {(hitRate * 100).toFixed(1)}%</span>
                    <span className="text-stone-400 font-mono">Sample: {data!.hits}/{data!.n}</span>
                    <span className="text-stone-500 text-[9px] mt-0.5">Target: ~{(d.midpoint * 100).toFixed(0)}%</span>
                  </div>
                )}

                {/* Theoretical Expected Calibration Target Marker */}
                <div
                  className="absolute w-full border-t border-dashed border-stone-600/70 z-0 pointer-events-none"
                  style={{ bottom: `${d.midpoint * 100}%` }}
                />

                {/* Empirical Hit Rate Bar */}
                {hasData ? (
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 relative z-10 ${
                      isMisaligned
                        ? 'bg-gradient-to-t from-rose-600 to-amber-500 shadow-md shadow-rose-900/30'
                        : 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-900/30'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-5 left-0 right-0 text-center text-[10px] font-mono text-stone-200">
                      {(hitRate * 100).toFixed(0)}%
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-1 bg-stone-800/60 rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2 text-center text-[9px] sm:text-[10px] font-mono text-stone-400">
          {ALL_DECILES.map((d) => (
            <div key={d.range} className="truncate">
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400 pt-2 border-t border-white/8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-teal-400" />
            <span>Well-Calibrated Hit Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
            <span>Overconfidence Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t border-dashed border-stone-400" />
            <span>Target Likelihood</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-stone-500">
          Active Bins: {buckets.length} / 10
        </div>
      </div>
    </div>
  );
};
