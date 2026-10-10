export const STUDIONET_CHAIN_ID = 61999;
export const STUDIONET_CHAIN_ID_HEX = '0xf22f';
export const STUDIONET_NAME = 'GenLayer Studionet';
export const STUDIONET_RPC_URL = 'https://studio.genlayer.com/api';
export const STUDIONET_EXPLORER_URL = 'https://explorer-studio.genlayer.com';

export const CALIBRATION_LEDGER_ADDRESS = '0x7D98a9272f23cDeD5E54A62fbC0d3A535ac7B7da';
export const CALIBRATED_COUNCIL_ADDRESS = '0x7B567289162C9D87a02B160B5494fb2Dfa3277ca';
export const CONTRACT_REPO_URL = 'https://github.com/huzyow155/calibration-ledger-genlayer';
export const DAPP_REPO_URL = 'https://github.com/huzyow155/calibration-desk-genlayer';

export const MIN_LEAD_SECONDS = 300;
export const CONTEST_WINDOW_SECONDS = 300;

export const ALLOWED_DOMAINS = [
  'raw.githubusercontent.com',
  'github.com',
  'reuters.com',
  'apnews.com',
  'bbc.com',
  'bloomberg.com',
  'wikipedia.org',
  'noaa.gov',
  'nasa.gov',
  'ecb.europa.eu',
];

// Persistent on-chain benchmark forecasters verified on GenLayer Studionet
export const DEMO_FORECASTER_A = {
  address: '0xDE0fbC71F750b591C8703A9C0080EA79a533ff41',
  label: 'Forecaster A (Overconfident Profile - The Trap Case)',
  description: 'Demonstrates quadratic Brier punishment. Predicted 9900 bp (99%) on failed booster catch (Case 2), triggering a severe (0.99 - 0)^2 = 0.9801 penalty and driving Brier score to 0.4913.',
  cases: [
    {
      id: 'c8467666af9c',
      title: 'FOMC Federal Funds Rate Cut Action',
      eventText: 'Did the Federal Open Market Committee decide to lower the target range for the federal funds rate by 25 basis points?',
      probBp: 9500,
      probPct: '95.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T03:17:26Z',
      sourceUrl: 'https://raw.githubusercontent.com/huzyow155/calibration-ledger-genlayer/main/fixtures/fomc_rate_cut.md',
      type: 'CORRECT_HIGH_CONFIDENCE',
    },
    {
      id: 'e9a52293efcd',
      title: 'Starship Flight 6 Booster Catch (The Trap Case)',
      eventText: 'Did engineers successfully catch the Super Heavy booster during the Starship Flight 6 test flight?',
      probBp: 9900,
      probPct: '99.00%',
      expectedOutcome: 'NO',
      actualOutcome: 'NO',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T03:17:26Z',
      sourceUrl: 'https://raw.githubusercontent.com/huzyow155/calibration-ledger-genlayer/main/fixtures/spacex_flight6.md',
      type: 'TRAP_OVERCONFIDENT_WRONG',
    },
  ],
};

export const DEMO_FORECASTER_B = {
  address: '0x13981fbbd3E42bf2D6170121ab9E0038CD4fEc46',
  label: 'Forecaster B (Well-Calibrated Profile)',
  description: 'Demonstrates superior calibration. Predicted low probability (1000 bp) on unlikely milestone delay that resolved NO, and high (9000 bp) on ECB rate cut, achieving an exceptional Brier score of 0.0100 (well within council gate).',
  cases: [
    {
      id: '70c79efd581b',
      title: 'Meridian Mainnet Phase 2 Initial Schedule',
      eventText: 'Did Project Meridian complete its Phase 2 mainnet launch on the initial schedule?',
      probBp: 1000,
      probPct: '10.00%',
      expectedOutcome: 'NO',
      actualOutcome: 'NO',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T03:17:26Z',
      sourceUrl: 'https://raw.githubusercontent.com/huzyow155/calibration-ledger-genlayer/main/fixtures/meridian_delays.md',
      type: 'CORRECT_LOW_CONFIDENCE',
    },
    {
      id: 'df37af300e33',
      title: 'ECB Deposit Facility Rate Decision',
      eventText: 'Did the Governing Council of the European Central Bank decide to decrease the deposit facility rate by 25 basis points?',
      probBp: 9000,
      probPct: '90.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T03:17:26Z',
      sourceUrl: 'https://raw.githubusercontent.com/huzyow155/calibration-ledger-genlayer/main/fixtures/ecb_rate_decision.md',
      type: 'WELL_CALIBRATED_MODERATE',
    },
  ],
};

export const DEMO_FORECASTER_C = {
  address: '0xb487065c4D3c3FB2d5065662fC5f90590917a041',
  label: 'Active Prediction (Provisional / Contested Demo)',
  description: 'Active prediction demonstrating the 300-second contest window, source re-evaluation, and transition to settled status.',
  cases: [
    {
      id: 'eec59d000adb',
      title: 'Certified Metropolitan Election Majority Tally',
      eventText: 'Did Candidate Davis secure the majority in the certified metropolitan election returns?',
      probBp: 8000,
      probPct: '80.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T03:17:26Z',
      sourceUrl: 'https://raw.githubusercontent.com/huzyow155/calibration-ledger-genlayer/main/fixtures/active_election.md',
      type: 'ACTIVE_CONTESTABLE',
    },
  ],
};
