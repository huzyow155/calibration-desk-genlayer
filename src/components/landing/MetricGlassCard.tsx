import React from 'react';
import { DotMatrix } from '../common/DotMatrix';

interface MetricGlassCardProps {
  cardIndex: number;
  title: string;
  badge: string;
  metricValue: string;
  metricUnit: string;
  caption: string;
  detailPoints: string[];
  accentColor?: string;
}

export const MetricGlassCard: React.FC<MetricGlassCardProps> = ({
  cardIndex,
  title,
  badge,
  metricValue,
  metricUnit,
  caption,
  detailPoints,
  accentColor = '#ffffff',
}) => {
  return (
    <div
      className="glass-metric-card group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#121418]/85 p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/70"
      style={
        {
          '--card-delay': `${cardIndex * 150}ms`,
        } as React.CSSProperties
      }
    >
      {/* SVG Turbulence Grain Overlay */}
      <div className="card-grain-overlay pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay" />

      {/* Diagonal Sheen (CSS ::before) */}
      <div className="card-sheen-sweep pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-75" />

      {/* Internal Content Container: Rigid Structure */}
      <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
        {/* Card Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-300 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
              {badge}
            </span>
            <span className="text-xs font-mono text-stone-500">
              CARD_0{cardIndex + 1}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95">
            {title}
          </h3>
        </div>

        {/* LED-Dot Matrix Metric Stage */}
        <div className="rounded-xl border border-white/8 bg-black/45 p-5 shadow-inner">
          <div className="mb-2 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
            VERIFIED METRIC // ON-CHAIN
          </div>
          
          <div className="flex items-baseline gap-2 overflow-x-auto py-1">
            <DotMatrix
              value={metricValue}
              size="lg"
              color={accentColor}
              className="drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
            />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-400">
              {metricUnit}
            </span>
          </div>
        </div>

        {/* Caption & Explanatory Breakdown */}
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-stone-300/90 font-light">
            {caption}
          </p>

          <div className="space-y-2 border-t border-white/8 pt-4">
            {detailPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-stone-400">
                <span className="text-stone-500 font-mono mt-0.5">•</span>
                <span className="leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
