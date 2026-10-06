import React from 'react';
import { DotMatrix } from '../common/DotMatrix';
import { ArrowUpRight } from 'lucide-react';

interface MetricGlassCardProps {
  cardIndex: number;
  title: string;
  badge: string;
  metricValue: string;
  metricUnit: string;
  caption: string;
  detailPoints: string[];
  variant?: 'rose' | 'purple' | 'amber';
  onLearnMore?: () => void;
}

export const MetricGlassCard: React.FC<MetricGlassCardProps> = ({
  cardIndex,
  title,
  badge,
  metricValue,
  metricUnit,
  caption,
  detailPoints,
  variant = 'rose',
  onLearnMore,
}) => {
  // Edge-to-edge vivid gradients and glass styling matching reference image
  const variantConfig = {
    rose: {
      gradient: 'linear-gradient(145deg, #f43f5e 0%, #e11d48 45%, #9f1239 100%)',
      borderColor: 'rgba(255, 255, 255, 0.28)',
      shadow: '0 20px 45px -12px rgba(159, 18, 57, 0.45)',
    },
    purple: {
      gradient: 'linear-gradient(145deg, #8b5cf6 0%, #7c3aed 45%, #4c1d95 100%)',
      borderColor: 'rgba(255, 255, 255, 0.28)',
      shadow: '0 20px 45px -12px rgba(76, 29, 149, 0.45)',
    },
    amber: {
      gradient: 'linear-gradient(145deg, #f59e0b 0%, #ea580c 45%, #9a3412 100%)',
      borderColor: 'rgba(255, 255, 255, 0.28)',
      shadow: '0 20px 45px -12px rgba(154, 52, 18, 0.45)',
    },
  }[variant];

  return (
    <div
      className="glass-metric-card entrance-reveal group relative overflow-hidden rounded-[28px] border p-7 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
      style={
        {
          background: variantConfig.gradient,
          borderColor: variantConfig.borderColor,
          boxShadow: variantConfig.shadow,
          '--card-delay': `${cardIndex * 150}ms`,
        } as React.CSSProperties
      }
    >
      {/* SVG Turbulence Grain Overlay inside Card */}
      <div className="card-grain-overlay pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />

      {/* Diagonal Sheen (CSS ::before) */}
      <div className="card-sheen-sweep pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-75" />

      {/* Internal Content Container */}
      <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
        {/* Card Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:bg-white/30">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {badge}
            </span>
            <span className="text-xs font-mono font-semibold text-white/80">
              CARD_0{cardIndex + 1}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white/95 transition-all duration-300 group-hover:text-white group-hover:scale-[1.02] origin-left">
            {title}
          </h3>
        </div>

        {/* LED-Dot Matrix Metric Inset Panel */}
        <div className="rounded-2xl border border-black/40 bg-black/55 p-5 shadow-2xl backdrop-blur-md transition-shadow duration-300 group-hover:shadow-inner">
          <div className="mb-2 text-[10px] font-mono font-semibold tracking-widest text-white/70 uppercase">
            VERIFIED METRIC // ON-CHAIN
          </div>
          
          <div className="flex items-baseline gap-2 overflow-x-auto py-1">
            <DotMatrix
              value={metricValue}
              size="lg"
              color="#ffffff"
              className="drop-shadow-[0_0_14px_rgba(255,255,255,0.7)]"
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
              {metricUnit}
            </span>
          </div>
        </div>

        {/* Caption & Explanatory Breakdown */}
        <div className="space-y-4">
          <p className="text-base leading-relaxed font-normal text-white/90 transition-opacity duration-300 group-hover:text-white group-hover:opacity-100">
            {caption}
          </p>

          <div className="space-y-2 border-t border-white/20 pt-4">
            {detailPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-white/90 leading-snug">
                <span className="font-mono mt-0.5 text-white/70">•</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rounded White Pill Learn More Button */}
        <div className="pt-2">
          <button
            onClick={onLearnMore}
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-stone-900 shadow-lg shadow-black/15 transition-all duration-200 hover:bg-stone-50 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] cursor-pointer"
          >
            <span>Learn More</span>
            <ArrowUpRight className="h-4 w-4 text-stone-900" />
          </button>
        </div>
      </div>
    </div>
  );
};
