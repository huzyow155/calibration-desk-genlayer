import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Scale, Shield, BarChart3, Binary } from 'lucide-react';
import { MetricGlassCard } from './MetricGlassCard';

interface LandingPageProps {
  onLaunchWorkbench: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchWorkbench }) => {
  const deepDiveRef = useRef<HTMLDivElement>(null);

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

  const scrollToDeepDive = () => {
    deepDiveRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-light-stage relative min-h-screen overflow-hidden py-12 sm:py-20 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* Two-Column Hero Section matching reference style */}
        <section className="entrance-reveal space-y-8 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/70 px-4 py-1.5 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-stone-700" />
            <span>GenLayer Studionet Preview // Autonomous Intelligent Adjudication</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Bold Headline with Dotted Glitch Accent */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-stone-900 leading-[1.04]">
                Calibration Over{' '}
                <span className="glitch-accent-word" title="Accuracy glitch metric">
                  Accuracy
                </span>
                <span className="block text-stone-600 font-extrabold text-3xl sm:text-5xl lg:text-6xl mt-2 tracking-tight">
                  Catching Overconfidence On-Chain
                </span>
              </h1>
            </div>

            {/* Right Column: Supporting narrative and Launch CTA */}
            <div className="lg:col-span-5 space-y-6 pt-2 lg:pt-3">
              <p className="text-lg sm:text-xl text-stone-700 leading-relaxed font-normal">
                Rewarding raw accuracy incentivizes claiming 99% certainty on the favorite.
                CalibrationLedger scores forecasters with proper Brier scoring and on-chain decile calibration
                histograms, penalizing overconfident misjudgments quadratically through multi-validator LLM consensus.
              </p>

              <div className="pt-2">
                <button
                  onClick={onLaunchWorkbench}
                  className="inline-flex items-center gap-3 rounded-full bg-stone-950 px-8 py-4 text-base font-semibold text-stone-50 shadow-xl shadow-stone-950/20 transition-all duration-200 hover:scale-[1.02] hover:bg-black hover:shadow-2xl active:scale-[0.98] cursor-pointer"
                >
                  <span>Launch Calibration Desk</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Real Metric Cards Section */}
        <section className="entrance-reveal space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase">
              MECHANISM HIGHLIGHTS // THREE EMPIRICAL PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Why Quadratic Scoring Changes Behavior
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-2">
            {/* Card 1: Quadratic Penalty (The Trap Case) - Rose Variant */}
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
              accentColor="#f43f5e"
              variant="rose"
              onLearnMore={scrollToDeepDive}
            />

            {/* Card 2: Zero Capital At Risk - Purple Variant */}
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
              accentColor="#8b5cf6"
              variant="purple"
              onLearnMore={scrollToDeepDive}
            />

            {/* Card 3: Decile Buckets - Amber Variant */}
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
              accentColor="#f59e0b"
              variant="amber"
              onLearnMore={scrollToDeepDive}
            />
          </div>
        </section>

        {/* Mechanism Deep-Dive & Comparison */}
        <div ref={deepDiveRef}>
          <section className="entrance-reveal rounded-3xl border border-stone-300/80 bg-white/80 p-8 sm:p-12 shadow-xl shadow-stone-900/5 backdrop-blur-xl space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase">
                THE CALIBRATION DISCOVERY
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                Accuracy vs. Calibration: The Core Distinction
              </h3>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
                In high-stakes decisions, a weather forecaster who predicts "70% chance of rain" is informative
                even when it doesn't rain, provided that across 100 similar forecasts it rains roughly 70 times.
                Binary markets fail to measure this nuance:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="rounded-2xl border border-rose-300 bg-rose-50/70 p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <Scale className="h-4 w-4" />
                  <span>The Naive Accuracy Metric</span>
                </div>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal">
                  Rewards always claiming maximal confidence on the most likely outcome. Forecasters who assign
                  99% probability on every favored horse look "90% accurate" when 9 win, but convey toxic certainty
                  and offer zero probability calibration.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>Proper Brier Calibration</span>
                </div>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal">
                  Applies a quadratic penalty: $(p - outcome)^2$. A single incorrect 9900 bp claim inflicts an
                  immense 0.9801 penalty, while honest forecasters expressing 50/50 uncertainty on toss-up events
                  preserve superior average scores.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
              <div className="flex items-center gap-3 text-xs text-stone-600 font-mono font-medium">
                <Binary className="h-4 w-4 text-stone-500" />
                <span>CONTRACT: 0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a</span>
              </div>

              <button
                onClick={onLaunchWorkbench}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-black transition-colors cursor-pointer"
              >
                <span>Explore On-Chain Records On Workbench</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Smooth gradient transition into the dark footer */}
      <div className="pointer-events-none mt-20 h-24 bg-gradient-to-b from-transparent to-[#08090b]" />
    </div>
  );
};
