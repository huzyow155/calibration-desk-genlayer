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
  description: 'Demonstrates quadratic Brier punishment. Predicted 9900 bp (99%) on maiden launch timing (Case 2), triggering a severe (0.99 - 0)^2 = 0.9801 penalty and driving Brier score to 0.4913.',
  cases: [
    {
      id: '53f6d83d16df',
      title: 'Apollo 11 Crewed Moon Landing',
      eventText: 'Did astronauts Neil Armstrong and Buzz Aldrin land on the Moon during the Apollo 11 mission?',
      probBp: 9500,
      probPct: '95.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T04:01:33Z',
      sourceUrl: 'https://en.wikipedia.org/wiki/Apollo_11',
      type: 'CORRECT_HIGH_CONFIDENCE',
    },
    {
      id: '86ee08dcfee2',
      title: 'Falcon 9 Maiden Launch Timing (The Trap Case)',
      eventText: 'Was the maiden launch of the Falcon 9 rocket conducted in the year 2020 or later?',
      probBp: 9900,
      probPct: '99.00%',
      expectedOutcome: 'NO',
      actualOutcome: 'NO',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T04:01:33Z',
      sourceUrl: 'https://en.wikipedia.org/wiki/Falcon_9',
      type: 'TRAP_OVERCONFIDENT_WRONG',
    },
  ],
};

export const DEMO_FORECASTER_B = {
  address: '0x13981fbbd3E42bf2D6170121ab9E0038CD4fEc46',
  label: 'Forecaster B (Well-Calibrated Profile)',
  description: 'Demonstrates superior calibration. Predicted low probability (1000 bp) on unlikely Boeing manufacturer claim that resolved NO, and high (9000 bp) on JWST infrared purpose that resolved YES, achieving an exceptional Brier score of 0.0100 (well within council gate).',
  cases: [
    {
      id: '5a7753c28378',
      title: 'Falcon 9 Manufacturer Verification',
      eventText: 'Is the Falcon 9 launch vehicle designed and manufactured by the Boeing company?',
      probBp: 1000,
      probPct: '10.00%',
      expectedOutcome: 'NO',
      actualOutcome: 'NO',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T04:01:33Z',
      sourceUrl: 'https://en.wikipedia.org/wiki/Falcon_9',
      type: 'CORRECT_LOW_CONFIDENCE',
    },
    {
      id: '37b05c2ee6b2',
      title: 'JWST Primary Infrared Astronomy Purpose',
      eventText: 'Is the James Webb Space Telescope designed primarily to conduct infrared astronomy?',
      probBp: 9000,
      probPct: '90.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T04:01:33Z',
      sourceUrl: 'https://en.wikipedia.org/wiki/James_Webb_Space_Telescope',
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
      id: '3393c1ce5063',
      title: 'Apollo 11 Crew Safe Return Aboard Columbia',
      eventText: 'Did the Apollo 11 astronauts return safely to Earth aboard the command module Columbia?',
      probBp: 8000,
      probPct: '80.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      resolveAfter: '2026-10-10T04:01:33Z',
      sourceUrl: 'https://en.wikipedia.org/wiki/Apollo_11',
      type: 'ACTIVE_CONTESTABLE',
    },
  ],
};
