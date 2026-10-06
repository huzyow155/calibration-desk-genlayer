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
  // Map our card variants to the reference design's layered gradient classes
  const variantClass = {
    rose: 'card--speed metric-card--speed',
    purple: 'card--context metric-card--context',
    amber: 'card--connections metric-card--connections',
  }[variant];

  return (
    <article
      className={`metric-card ${variantClass} group p-7 sm:p-8 flex flex-col justify-between`}
    >
      {/* Reference SVG Grain Overlay with feComponentTransfer */}
      <svg className="card__grain" viewBox="0 0 429 554" aria-hidden="true">
        <rect width="100%" height="100%" filter="url(#cardNoise)" />
      </svg>

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

          <h3 className="card-title text-2xl sm:text-3xl font-semibold tracking-tight text-white/95 transition-all duration-300 group-hover:text-white group-hover:scale-[1.02] origin-left">
            {title}
          </h3>
        </div>

        {/* LED-Dot Matrix Metric Inset Window */}
        <div className="card-metric rounded-2xl border border-black/35 bg-black/55 p-5 shadow-2xl backdrop-blur-md transition-shadow duration-300 group-hover:shadow-inner">
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
          <p className="card-caption text-base leading-relaxed font-normal text-white/90 transition-opacity duration-300 group-hover:text-white group-hover:opacity-100">
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

        {/* Reference Rounded White Pill Learn More Button */}
        <div className="pt-2">
          <button
            onClick={onLearnMore}
            type="button"
            className="learn-more-btn w-full py-3 px-5 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider"
          >
            <span>Learn More</span>
            <ArrowUpRight className="h-4 w-4 text-stone-900" />
          </button>
        </div>
      </div>
    </article>
  );
};
