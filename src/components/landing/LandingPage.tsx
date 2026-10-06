import React, { useEffect } from 'react';
import { ArrowRight, Sparkles, Scale, Shield, BarChart3, Binary } from 'lucide-react';
import { MetricGlassCard } from './MetricGlassCard';

interface LandingPageProps {
  onLaunchWorkbench: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchWorkbench }) => {
  useEffect(() => {
    // Reveal animation observer respecting prefers-reduced-motion
    const elements = document.querySelectorAll<HTMLElement>('.entrance-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden py-12 sm:py-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,210,225,0.08),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl text-center space-y-8 entrance-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-stone-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-stone-300" />
            <span>GenLayer Studionet Preview // Autonomous Intelligent Adjudication</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Calibration Over Accuracy:
              <span className="block bg-gradient-to-r from-stone-200 via-stone-400 to-stone-500 bg-clip-text text-transparent">
                Catching Overconfidence On-Chain
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-stone-300/80 leading-relaxed font-light pt-2">
              Rewarding raw accuracy incentivizes claiming 99% certainty on the favorite.
              CalibrationLedger scores forecasters with proper Brier scoring and on-chain decile calibration
              histograms, penalizing overconfident misjudgments quadratically through multi-validator LLM consensus.
            </p>
          </div>

          {/* Primary CTA button */}
          <div className="pt-2">
            <button
              onClick={onLaunchWorkbench}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-b from-white via-stone-200 to-stone-400 px-8 py-4 text-sm font-semibold text-stone-900 shadow-xl shadow-white/10 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20 active:scale-[0.98] cursor-pointer"
            >
              <span>Launch Calibration Desk</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* 3 Real Metric Cards Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
              MECHANISM HIGHLIGHTS // THREE EMPIRICAL PILLARS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Why Quadratic Scoring Changes Behavior
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
            {/* Card 1: Quadratic Penalty (The Trap Case) */}
            <MetricGlassCard
              cardIndex={0}
              title="Quadratic Penalty"
              badge="Trap Test Proven"
              metricValue="+9.00%"
              metricUnit="PENALTY"
              caption="Extra Brier score penalty from just one overconfident wrong call, even when raw hit rate is identical at 90.0%."
              detailPoints={[
                'Forecaster A (9900 bp on all 10 calls): 9 hits (0.0001 each) + 1 miss (0.9801 penalty) = 0.0981 Brier score.',
                'Forecaster B (calibrated 9000 bp): 9 hits (0.0100 each) + 1 miss (0.8100 penalty) = 0.0900 Brier score.',
                'Forecaster B scores superiorly because Brier score penalizes false certainty quadratically.',
              ]}
              accentColor="#f87171"
            />

            {/* Card 2: Zero Capital At Risk */}
            <MetricGlassCard
              cardIndex={1}
              title="Zero Capital At Risk"
              badge="Zero Collateral"
              metricValue="0"
              metricUnit="GEN STAKE"
              caption="Zero-collateral forecasting. No GEN required to register or resolve predictions. Evaluated purely on statistical foresight."
              detailPoints={[
                'Prediction markets reward capital size and financial leverage rather than genuine calibration.',
                'CalibrationLedger isolates forecaster skill from wallet balance.',
                'Multi-validator LLM consensus checks verbatim quotations in submitted evidence.',
              ]}
              accentColor="#60a5fa"
            />

            {/* Card 3: Decile Buckets */}
            <MetricGlassCard
              cardIndex={2}
              title="Decile Calibration"
              badge="10-Decile Bins"
              metricValue="10"
              metricUnit="BUCKETS"
              caption="Predictions are grouped into 10 confidence decile bins with empirical hit rates, plotting a transparent on-chain calibration curve."
              detailPoints={[
                'Grouped by probability: 0-10, 10-20, 20-30, up to 90-100 basis point ranges.',
                'A well-calibrated forecaster hits ~70% of the events they label 70% likely.',
                'Calculated fresh on demand from stored predictions with zero aggregation drift.',
              ]}
              accentColor="#34d399"
            />
          </div>
        </section>

        {/* Mechanism Deep-Dive & Comparison */}
        <section className="rounded-3xl border border-white/10 bg-[#121418]/70 p-8 sm:p-12 backdrop-blur-xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
              THE CALIBRATION DISCOVERY
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Accuracy vs. Calibration: The Core Distinction
            </h3>
            <p className="text-stone-300/85 text-sm sm:text-base leading-relaxed font-light">
              In high-stakes decisions, a weather forecaster who predicts "70% chance of rain" is informative
              even when it doesn't rain, provided that across 100 similar forecasts it rains roughly 70 times.
              Binary markets fail to measure this nuance:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <Scale className="h-4 w-4" />
                <span>The Naive Accuracy Metric</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Rewards always claiming maximal confidence on the most likely outcome. Forecasters who assign
                99% probability on every favored horse look "90% accurate" when 9 win, but convey toxic certainty
                and offer zero probability calibration.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <BarChart3 className="h-4 w-4" />
                <span>Proper Brier Calibration</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                Applies a quadratic penalty: $(p - outcome)^2$. A single incorrect 9900 bp claim inflicts an
                immense 0.9801 penalty, while honest forecasters expressing 50/50 uncertainty on toss-up events
                preserve superior average scores.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
              <Binary className="h-4 w-4 text-stone-400" />
              <span>CONTRACT: 0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a</span>
            </div>

            <button
              onClick={onLaunchWorkbench}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-stone-300 transition-colors cursor-pointer"
            >
              <span>Explore On-Chain Records On Workbench</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
