# CalibrationDesk (GenLayer Studionet)

Production dApp frontend for `CalibrationLedger`, an on-chain forecaster calibration evaluator powered by GenLayer's Intelligent Contracts.

## Overview

Accuracy alone rewards the wrong behavior: a forecaster who predicts "whatever is most likely" looks superficially accurate but provides little informative value, whereas a well-calibrated forecaster (right ~70% of the times they assign 70% probability) provides valuable probabilistic intelligence.

`CalibrationLedger` scores forecasters on calibration rather than raw hit-rate using the strictly proper Brier scoring rule and an empirical decile histogram. All evaluation happens on-chain on GenLayer Studionet without capital collateral.

- **Deployed CalibrationLedger Contract**: `0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a`
- **Deployed CalibratedCouncil Consumer**: `0xbaB6Ac817D544A65e72dB933897031059c8601EF`
- **Network**: GenLayer Studionet (Chain ID `61999`, RPC `https://studio.genlayer.com/api`)
- **Canonical Contract Repository**: [huzyow155/calibration-ledger-genlayer](https://github.com/huzyow155/calibration-ledger-genlayer)
- **Contract Code SHA-256**: `53805eef041b364b16f302c4c46209e5e4467788ed6cb3fcd2d19c2718274e91`

---

## Two-Page Architecture

1. **Landing Page (`/`)**:
   - 3 rigid-aspect glass cards displaying verified metrics:
     - **Card 1: Quadratic Penalty (`+9.00%`)**: Verified trap-test result illustrating Brier penalty on overconfident calls.
     - **Card 2: Zero Collateral (`0 GEN`)**: No capital requirement to register predictions or submit resolution evidence.
     - **Card 3: Decile Buckets (`10 Buckets`)**: Granular calibration curve comparing predicted confidence vs. realized outcome hit rate.
   - Clean explainer of the mathematics behind strictly proper scoring rules.
   - Zero wallet connection or contract read overhead on landing.

2. **Calibration Desk Workbench (`/app`)**:
   - **Persistent On-Chain Showcase**: Immediate no-wallet access to existing on-chain forecaster records:
     - **Forecaster A (Trap Case Demo)**: `0xc65E820fb874748Bf169739844f545a3543D0c50` (9900 bp overconfident miss on ID `40b6e6aa4f33`, Brier `0.49505`).
     - **Forecaster B (Well-Calibrated Demo)**: `0x5365D235deed7c291Bb21aA36938F783EFFB2D29` (Brier `0.01625`).
   - **Interactive Decile Histogram**: Visual calibration curve showing actual hit rate vs expected probability line across 10 confidence deciles.
   - **Wallet Connection**: EIP-6963 multi-wallet discovery and standard injected wallet support.
   - **Register Prediction**: Submit future event statements, probability in basis points (1..9999 bp), and optional deadline hint.
   - **Resolve Event**: Submit verified real-world evidence URLs and text for deterministic LLM quote extraction and outcome classification (`YES` / `NO` / `AMBIGUOUS`).
   - **Consumer Integration (`CalibratedCouncil`)**: Cross-contract gate enforcing maximum Brier score &le; 0.1500 and &ge; 2 scored events before allowing policy endorsement.

---

## Visual Techniques

- **Rigid-Aspect Glass Cards**: Fixed aspect ratio scaling uniformly via CSS custom property `--u`.
- **Procedural Sheen & Grain**: Diagonal reflection (`::before`) and SVG `feTurbulence` noise blend.
- **7-Row LED-Dot Numbers**: Custom bitmap-rendered dot matrix display for on-chain metrics.
- **Accessible Entrance Choreography**: Staggered motion transitions disabled automatically when `prefers-reduced-motion` is active.

---

## Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Run quality and security audits
python scripts/scan_banned_words.py
python scripts/scan_secrets.py
python scripts/scan_ascii.py
```

---

## Deployment

Deployable to Vercel, Netlify, or any static hosting platform.

Built with Vite, React 19, TypeScript, Tailwind CSS, and `genlayer-js`.
