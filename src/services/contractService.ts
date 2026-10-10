import { createClient, chains } from 'genlayer-js';
import {
  CALIBRATION_LEDGER_ADDRESS,
  CALIBRATED_COUNCIL_ADDRESS,
  STUDIONET_CHAIN_ID,
  STUDIONET_NAME,
  STUDIONET_RPC_URL,
  STUDIONET_EXPLORER_URL,
} from '../config/chain';
import type {
  PredictionRecord,
  CalibrationReport,
  CouncilEndorsement,
} from '../types/prediction';

export const STUDIONET_CONFIG = chains?.studionet || {
  id: STUDIONET_CHAIN_ID,
  name: STUDIONET_NAME,
  rpcUrls: { default: { http: [STUDIONET_RPC_URL] } },
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'GenLayer Explorer',
      url: STUDIONET_EXPLORER_URL,
    },
  },
};

// Public read-only client: works without connecting any wallet
export const publicClient = createClient({
  chain: STUDIONET_CONFIG,
});

// Write client instantiated when user connects their browser wallet provider
export function getWriteClient(account: string, provider: any) {
  return createClient({
    chain: STUDIONET_CONFIG,
    account: account as `0x${string}`,
    provider,
  });
}

// ---------------------------------------------------------------------------
// READ METHODS (Public, no wallet required)
// ---------------------------------------------------------------------------

export async function fetchPrediction(predictionId: string): Promise<PredictionRecord | null> {
  try {
    const raw: any = await publicClient.readContract({
      address: CALIBRATION_LEDGER_ADDRESS,
      functionName: 'get_prediction',
      args: [predictionId],
    });
    if (!raw || raw === '""' || raw === '{}') return null;
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as PredictionRecord);
  } catch (err) {
    console.error('fetchPrediction error:', err);
    return null;
  }
}

export async function fetchPredictionsByForecaster(
  forecaster: string,
  limit = 20
): Promise<string[]> {
  try {
    const raw: any = await publicClient.readContract({
      address: CALIBRATION_LEDGER_ADDRESS,
      functionName: 'list_predictions_by_forecaster',
      args: [forecaster, limit],
    });
    if (!raw || raw === '[]' || raw === '') return [];
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as string[]);
  } catch (err) {
    console.error('fetchPredictionsByForecaster error:', err);
    return [];
  }
}

export async function fetchCalibrationReport(
  forecaster: string
): Promise<CalibrationReport | null> {
  try {
    const raw: any = await publicClient.readContract({
      address: CALIBRATION_LEDGER_ADDRESS,
      functionName: 'get_calibration_report',
      args: [forecaster],
    });
    if (!raw || raw === '""' || raw === '{}') return null;
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as CalibrationReport);
  } catch (err) {
    console.error('fetchCalibrationReport error:', err);
    return null;
  }
}

export async function fetchCouncilEndorsement(
  endorsementId: string
): Promise<CouncilEndorsement | null> {
  try {
    const raw: any = await publicClient.readContract({
      address: CALIBRATED_COUNCIL_ADDRESS,
      functionName: 'get_endorsement',
      args: [endorsementId],
    });
    if (!raw || raw === '""' || raw === '{}') return null;
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as CouncilEndorsement);
  } catch (err) {
    console.error('fetchCouncilEndorsement error:', err);
    return null;
  }
}

export async function fetchCouncilRecent(limit = 10): Promise<string[]> {
  try {
    const raw: any = await publicClient.readContract({
      address: CALIBRATED_COUNCIL_ADDRESS,
      functionName: 'list_recent',
      args: [limit],
    });
    if (!raw || raw === '[]' || raw === '') return [];
    return typeof raw === 'string' ? JSON.parse(raw) : (raw as string[]);
  } catch (err) {
    console.error('fetchCouncilRecent error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// WRITE METHODS (Interactive, signed via connected wallet)
// ---------------------------------------------------------------------------

export async function executeRegisterPrediction(
  writeClient: any,
  eventText: string,
  probBp: number,
  resolveAfter: string,
  sourceUrl: string
): Promise<string> {
  return await writeClient.writeContract({
    address: CALIBRATION_LEDGER_ADDRESS,
    functionName: 'register_prediction',
    args: [eventText, probBp, resolveAfter, sourceUrl],
  });
}

export async function executeResolveEvent(
  writeClient: any,
  predictionId: string
): Promise<string> {
  return await writeClient.writeContract({
    address: CALIBRATION_LEDGER_ADDRESS,
    functionName: 'resolve_event',
    args: [predictionId],
  });
}

export async function executeContestResolution(
  writeClient: any,
  predictionId: string,
  altSourceUrl = ''
): Promise<string> {
  return await writeClient.writeContract({
    address: CALIBRATION_LEDGER_ADDRESS,
    functionName: 'contest_resolution',
    args: [predictionId, altSourceUrl],
  });
}

export async function executeSettle(
  writeClient: any,
  predictionId: string
): Promise<string> {
  return await writeClient.writeContract({
    address: CALIBRATION_LEDGER_ADDRESS,
    functionName: 'settle',
    args: [predictionId],
  });
}

export async function executeCouncilEndorse(
  writeClient: any,
  statement: string
): Promise<string> {
  return await writeClient.writeContract({
    address: CALIBRATED_COUNCIL_ADDRESS,
    functionName: 'endorse_policy',
    args: [statement],
  });
}

// ---------------------------------------------------------------------------
// RECEIPT POLLING HELPER
// ---------------------------------------------------------------------------

export async function waitForReceiptWithProgress(
  client: any,
  txHash: string,
  onTick?: (seconds: number) => void
): Promise<{ receipt: any; success: boolean; durationSec: number }> {
  const startTime = Date.now();
  let timer: any = null;

  if (onTick) {
    timer = setInterval(() => {
      onTick(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
  }

  try {
    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      retries: 120,
      interval: 3000,
    });

    if (timer) clearInterval(timer);
    const durationSec = Math.round((Date.now() - startTime) / 1000);

    const leaderExec =
      receipt?.consensus_data?.leader_receipt?.[0]?.execution_result || receipt?.result_name;
    const isSuccess = receipt?.status_name === 'ACCEPTED' && leaderExec === 'SUCCESS';

    return {
      receipt,
      success: isSuccess,
      durationSec,
    };
  } catch (error) {
    if (timer) clearInterval(timer);
    throw error;
  }
}
