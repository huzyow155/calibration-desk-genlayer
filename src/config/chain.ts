export const STUDIONET_CHAIN_ID = 61999;
export const STUDIONET_CHAIN_ID_HEX = '0xf22f';
export const STUDIONET_NAME = 'GenLayer Studionet';
export const STUDIONET_RPC_URL = 'https://studio.genlayer.com/api';
export const STUDIONET_EXPLORER_URL = 'https://explorer-studio.genlayer.com';

export const CALIBRATION_LEDGER_ADDRESS = '0xAaD7A38119EeE71CAC50ddf112d4E12fBB00026a';
export const CALIBRATED_COUNCIL_ADDRESS = '0xbaB6Ac817D544A65e72dB933897031059c8601EF';
export const CONTRACT_REPO_URL = 'https://github.com/huzyow155/calibration-ledger-genlayer';
export const DAPP_REPO_URL = 'https://github.com/huzyow155/calibration-desk-genlayer';

// Real persistent on-chain forecaster addresses and cases verified on-chain today
export const DEMO_FORECASTER_A = {
  address: '0xc65E820fb874748Bf169739844f545a3543D0c50',
  label: 'Forecaster A (Overconfident Profile - The Trap Case)',
  description: 'Demonstrates quadratic Brier punishment. Predicted 9900 bp on SpaceX lunar landing that failed (Case 2), triggering a severe (0.99 - 0)^2 = 0.9801 penalty and driving Brier score to 0.49505.',
  cases: [
    {
      id: '8bb0c3ef8d2d',
      title: 'Apple iPhone 16 Keynote Announcement',
      eventText: 'Did Apple announce the iPhone 16 series with Apple Intelligence in September 2024?',
      probBp: 9000,
      probPct: '90.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      deadlineHint: '2024-09-30',
      evidenceText: "Apple officially unveiled the iPhone 16 family powered by Apple Intelligence during its 'It's Glowtime' keynote event on September 9 2024 in Cupertino.",
      type: 'CORRECT_HIGH_CONFIDENCE',
    },
    {
      id: '40b6e6aa4f33',
      title: 'SpaceX Lunar Starship Mission Launch (The Trap Case)',
      eventText: 'Did SpaceX launch the lunar Starship uncrewed Moon landing mission before October 2026?',
      probBp: 9900,
      probPct: '99.00%',
      expectedOutcome: 'NO',
      actualOutcome: 'NO',
      resolutionQuote: 'GROUNDED',
      deadlineHint: '2026-10-01',
      evidenceText: 'As of October 2026, NASA and SpaceX confirmed the uncrewed Starship lunar landing demonstration remains in development and has not yet launched to the lunar surface.',
      type: 'TRAP_OVERCONFIDENT_WRONG',
    },
    {
      id: '51fba249d92a',
      title: 'Global Atmospheric CO2 Average Below 400ppm',
      eventText: 'Did global atmospheric carbon dioxide average fall below 400 ppm in 2026?',
      probBp: 1500,
      probPct: '15.00%',
      expectedOutcome: 'AMBIGUOUS',
      actualOutcome: 'AMBIGUOUS',
      resolutionQuote: 'NONE',
      deadlineHint: '2026-12-31',
      evidenceText: 'Local weather stations in rural Vermont recorded calm winds, mild autumn temperatures, and fluctuating barometric pressure readings throughout late September.',
      type: 'AMBIGUOUS_WASH',
    },
  ],
};

export const DEMO_FORECASTER_B = {
  address: '0x5365D235deed7c291Bb21aA36938F783EFFB2D29',
  label: 'Forecaster B (Well-Calibrated Profile)',
  description: 'Demonstrates superior calibration. Predicted low probability (1000 bp) on unlikely Bitcoin drop that resolved NO, and moderate (8500 bp) on Olympic Games conclusion, achieving a pristine Brier score of 0.01625.',
  cases: [
    {
      id: 'ba4d81bde492',
      title: 'Bitcoin Price Crash Below 10,000 USD in Q4 2026',
      eventText: 'Will Bitcoin trade below 10000 USD during the fourth quarter of 2026?',
      probBp: 1000,
      probPct: '10.00%',
      expectedOutcome: 'NO',
      actualOutcome: 'NO',
      resolutionQuote: 'GROUNDED',
      deadlineHint: '2026-12-31',
      evidenceText: 'Market data from major exchanges confirmed Bitcoin was trading securely in the 60000 to 75000 USD channel throughout Q4 2026, never approaching 10000 USD.',
      type: 'CORRECT_LOW_CONFIDENCE',
    },
    {
      id: 'c405317beea2',
      title: 'Paris 2024 Olympic Games Closing Ceremony',
      eventText: 'Did the Paris 2024 Summer Olympic Games conclude in August 2024?',
      probBp: 8500,
      probPct: '85.00%',
      expectedOutcome: 'YES',
      actualOutcome: 'YES',
      resolutionQuote: 'GROUNDED',
      deadlineHint: '2024-08-31',
      evidenceText: 'The International Olympic Committee and Paris organizers held the official closing ceremony for the 2024 Olympic Games on August 11 2024 at Stade de France.',
      type: 'WELL_CALIBRATED_MODERATE',
    },
  ],
};
