# Contracts Reference

This directory contains unmodified copies of the Intelligent Contracts deployed on GenLayer Studionet, verified against the deployed on-chain code.

## Canonical Contract Repository
- Canonical GitHub Repository: [https://github.com/huzyow155/calibration-ledger-genlayer](https://github.com/huzyow155/calibration-ledger-genlayer)

## Deployed Contracts

### 1. CalibrationLedger
- **Address**: `0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a`
- **Network**: GenLayer Studionet (Chain ID 61999)
- **Explorer**: [https://explorer-studio.genlayer.com/address/0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a](https://explorer-studio.genlayer.com/address/0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a)
- **Deploy Transaction**: `0xc2209c807b1c89eef8381102143dc890c7bdeee6c8cd7608aba9f77a7c4f5429`
- **Source File**: `CalibrationLedger.py`
- **Source SHA-256**: `53805eef041b364b16f302c4c46209e5e4467788ed6cb3fcd2d19c2718274e91`
- **Verification Match**: Exact match with on-chain decoded source from deployment transaction.

### 2. CalibratedCouncil (Consumer Contract)
- **Address**: `0xbaB6Ac817D544A65e72dB933897031059c8601EF`
- **Network**: GenLayer Studionet (Chain ID 61999)
- **Explorer**: [https://explorer-studio.genlayer.com/address/0xbaB6Ac817D544A65e72dB933897031059c8601EF](https://explorer-studio.genlayer.com/address/0xbaB6Ac817D544A65e72dB933897031059c8601EF)
- **Deploy Transaction**: `0xa2c3da4846fac1393b3e888ad628f115e9676c73f6eeec0fa94d6a5d409ae307`
- **Source File**: `CalibratedCouncil.py`
- **Description**: Downstream consumer demonstrating cross-contract reusability. Gates policy endorsements to forecasters with a verified Brier score below 0.15 and at least 2 scored predictions.
