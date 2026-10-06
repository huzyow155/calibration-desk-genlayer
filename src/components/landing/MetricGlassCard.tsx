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
  accentColor?: string;
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
  accentColor = '#ffffff',
  variant = 'rose',
  onLearnMore,
}) => {
  // Theme gradients & styling variants matching colorful translucent aesthetic
  const variantStyles = {
    rose: {
      cardBg: 'bg-gradient-to-br from-[#ffdde1]/90 via-[#ee9ca7]/80 to-[#ff758c]/85 border-[#f43f5e]/30 shadow-rose-950/15',
      badgeBg: 'border-rose-900/20 bg-rose-950/10 text-rose-950',
      badgeDot: 'bg-rose-600',
      cardNum: 'text-rose-900/60',
      titleColor: 'text-stone-900 group-hover:text-black',
      dotContainer: 'border-rose-950/20 bg-stone-950/85 shadow-inner',
      metricLabel: 'text-rose-200/80',
      metricUnitColor: 'text-rose-200',
      captionColor: 'text-stone-900/80 group-hover:text-stone-950',
      detailColor: 'text-stone-800/85',
      bulletColor: 'text-rose-800',
      divider: 'border-rose-950/15',
      pillBtn: 'border-rose-900/20 bg-stone-900 text-stone-100 hover:bg-black hover:text-white hover:border-stone-900 shadow-md',
    },
    purple: {
      cardBg: 'bg-gradient-to-br from-[#e0c3fc]/90 via-[#8ec5fc]/75 to-[#a18cd1]/85 border-[#8b5cf6]/30 shadow-purple-950/15',
      badgeBg: 'border-purple-900/20 bg-purple-950/10 text-purple-950',
      badgeDot: 'bg-purple-600',
      cardNum: 'text-purple-900/60',
      titleColor: 'text-stone-900 group-hover:text-black',
      dotContainer: 'border-purple-950/20 bg-stone-950/85 shadow-inner',
      metricLabel: 'text-purple-200/80',
      metricUnitColor: 'text-purple-200',
      captionColor: 'text-stone-900/80 group-hover:text-stone-950',
      detailColor: 'text-stone-800/85',
      bulletColor: 'text-purple-800',
      divider: 'border-purple-950/15',
      pillBtn: 'border-purple-900/20 bg-stone-900 text-stone-100 hover:bg-black hover:text-white hover:border-stone-900 shadow-md',
    },
    amber: {
      cardBg: 'bg-gradient-to-br from-[#ffd194]/90 via-[#f7bb97]/80 to-[#f6a064]/85 border-[#f59e0b]/30 shadow-amber-950/15',
      badgeBg: 'border-amber-900/20 bg-amber-950/10 text-amber-950',
      badgeDot: 'bg-amber-600',
      cardNum: 'text-amber-900/60',
      titleColor: 'text-stone-900 group-hover:text-black',
      dotContainer: 'border-amber-950/20 bg-stone-950/85 shadow-inner',
      metricLabel: 'text-amber-200/80',
      metricUnitColor: 'text-amber-200',
      captionColor: 'text-stone-900/80 group-hover:text-stone-950',
      detailColor: 'text-stone-800/85',
      bulletColor: 'text-amber-800',
      divider: 'border-amber-950/15',
      pillBtn: 'border-amber-900/20 bg-stone-900 text-stone-100 hover:bg-black hover:text-white hover:border-stone-900 shadow-md',
    },
  }[variant];

  return (
    <div
      className={`glass-metric-card entrance-reveal group relative overflow-hidden rounded-[28px] border p-7 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl ${variantStyles.cardBg}`}
      style={
        {
          '--card-delay': `${cardIndex * 150}ms`,
        } as React.CSSProperties
      }
    >
      {/* SVG Turbulence Grain Overlay */}
      <div className="card-grain-overlay pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply" />

      {/* Diagonal Sheen (CSS ::before) */}
      <div className="card-sheen-sweep pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 group-hover:opacity-85" />

      {/* Internal Content Container: Rigid Structure */}
      <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
        {/* Card Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${variantStyles.badgeBg}`}>
              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${variantStyles.badgeDot}`} />
              {badge}
            </span>
            <span className={`text-xs font-mono font-semibold ${variantStyles.cardNum}`}>
              CARD_0{cardIndex + 1}
            </span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-transform duration-300 group-hover:scale-[1.02] ${variantStyles.titleColor}`}>
            {title}
          </h3>
        </div>

        {/* LED-Dot Matrix Metric Stage */}
        <div className={`rounded-2xl border p-5 transition-transform duration-300 group-hover:shadow-lg ${variantStyles.dotContainer}`}>
          <div className={`mb-2 text-[10px] font-mono tracking-widest uppercase ${variantStyles.metricLabel}`}>
            VERIFIED METRIC // ON-CHAIN
          </div>
          
          <div className="flex items-baseline gap-2 overflow-x-auto py-1">
            <DotMatrix
              value={metricValue}
              size="lg"
              color={accentColor}
              className="drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            />
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${variantStyles.metricUnitColor}`}>
              {metricUnit}
            </span>
          </div>
        </div>

        {/* Caption & Explanatory Breakdown */}
        <div className="space-y-4">
          <p className={`text-base leading-relaxed font-normal transition-opacity duration-300 ${variantStyles.captionColor}`}>
            {caption}
          </p>

          <div className={`space-y-2 border-t pt-4 ${variantStyles.divider}`}>
            {detailPoints.map((point, idx) => (
              <div key={idx} className={`flex items-start gap-2 text-xs font-medium ${variantStyles.detailColor}`}>
                <span className={`font-mono mt-0.5 ${variantStyles.bulletColor}`}>•</span>
                <span className="leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learn More Pill Button */}
        <div className="pt-2">
          <button
            onClick={onLearnMore}
            type="button"
            className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${variantStyles.pillBtn}`}
          >
            <span>Learn More</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
