# Contracts Reference

This directory contains unmodified copies of the Intelligent Contracts deployed on GenLayer Studionet, verified against the deployed on-chain code.

## Canonical Contract Repository
- Canonical GitHub Repository: [https://github.com/huzyow155/calibration-ledger-genlayer](https://github.com/huzyow155/calibration-ledger-genlayer)

## Deployed Contracts

### 1. CalibrationLedger
- **Address**: `0x7D98a9272f23cDeD5E54A62fbC0d3A535ac7B7da`
- **Network**: GenLayer Studionet (Chain ID 61999)
- **Explorer**: [https://explorer-studio.genlayer.com/address/0x7D98a9272f23cDeD5E54A62fbC0d3A535ac7B7da](https://explorer-studio.genlayer.com/address/0x7D98a9272f23cDeD5E54A62fbC0d3A535ac7B7da)
- **Deploy Transaction**: `0x08d16a79069003b16fffd749ce383519c5abd89c727b435d560e3e62f647266e`
- **Source File**: `CalibrationLedger.py`
- **Source SHA-256**: `60335bb7fff387711341dc65b3a226127851a350f415ee7f8c105d33762b279b`
- **Verification Match**: Exact match with on-chain decoded source from deployment transaction (`eth_getTransactionByHash` field `result.data.contract_code`).

### 2. CalibratedCouncil (Consumer Contract)
- **Address**: `0x7B567289162C9D87a02B160B5494fb2Dfa3277ca`
- **Network**: GenLayer Studionet (Chain ID 61999)
- **Explorer**: [https://explorer-studio.genlayer.com/address/0x7B567289162C9D87a02B160B5494fb2Dfa3277ca](https://explorer-studio.genlayer.com/address/0x7B567289162C9D87a02B160B5494fb2Dfa3277ca)
- **Deploy Transaction**: `0x25f3e7e3e7b0922d3257abc14917e07874e62e342589c6d1e2e7c2661fcffb94`
- **Source File**: `CalibratedCouncil.py`
- **Source SHA-256**: `fadd11f11430e82d2c1c8e641bbaff2770f05b8faa5d798f651246ddc8a9ccfa`
- **Description**: Downstream consumer demonstrating cross-contract reusability. Gates policy endorsements to forecasters with a verified Brier score below 0.15 and at least 2 settled scored predictions.
