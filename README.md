# CalibrationDesk (GenLayer Studionet)

Production dApp frontend for `CalibrationLedger`, an on-chain forecaster calibration evaluator powered by GenLayer's Intelligent Contracts.

**Live Demo**: https://calibration-desk-genlayer.vercel.app

## Overview

Accuracy alone rewards the wrong behavior: a forecaster who predicts "whatever is most likely" looks superficially accurate but provides little informative value, whereas a well-calibrated forecaster (right ~70% of the times they assign 70% probability) provides valuable probabilistic intelligence.

`CalibrationLedger` scores forecasters on calibration rather than raw hit-rate using the strictly proper Brier scoring rule and an empirical decile histogram. All evaluation happens on-chain on GenLayer Studionet without capital collateral.

- **Deployed CalibrationLedger Contract**: `0x7D98a9272f23cDeD5E54A62fbC0d3A535ac7B7da`
- **Deployed CalibratedCouncil Consumer**: `0x7B567289162C9D87a02B160B5494fb2Dfa3277ca`
- **Network**: GenLayer Studionet (Chain ID `61999`, RPC `https://studio.genlayer.com/api`)
- **Canonical Contract Repository**: [huzyow155/calibration-ledger-genlayer](https://github.com/huzyow155/calibration-ledger-genlayer)
- **CalibrationLedger SHA-256**: `60335bb7fff387711341dc65b3a226127851a350f415ee7f8c105d33762b279b`
- **CalibratedCouncil SHA-256**: `fadd11f11430e82d2c1c8e641bbaff2770f05b8faa5d798f651246ddc8a9ccfa`

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
     - **Forecaster A (Trap Case Demo)**: `0xDE0fbC71F750b591C8703A9C0080EA79a533ff41` (FOMC rate cut & Starship Flight 6 trap case, Brier `0.4913`).
     - **Forecaster B (Well-Calibrated Demo)**: `0x13981fbbd3E42bf2D6170121ab9E0038CD4fEc46` (Project Meridian & ECB rate decision, Brier `0.0100`).
      - **Forecaster C (Contested Demo)**: `0xb487065c4D3c3FB2d5065662fC5f90590917a041` (Candidate Davis election forecast, contested in 300s window).
   - **Interactive Decile Histogram**: Visual calibration curve showing actual hit rate vs expected probability line across 10 confidence deciles.
   - **Wallet Connection**: EIP-6963 multi-wallet discovery and standard injected wallet support.
   - **Register Prediction**: Submit future event statements, probability in basis points (1..9999 bp), ISO-8601 UTC resolve deadline (resolve_after), and allowlisted source URL.
   - **Resolve Event**: Contract fetches authoritative text directly from fixed allowlisted domains with 300s provisional contest window before final settlement.
   - **Consumer Integration (`CalibratedCouncil`)**: Cross-contract gate enforcing maximum Brier score &le; 0.1500 and &ge; 2 settled events before allowing policy endorsement.

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
