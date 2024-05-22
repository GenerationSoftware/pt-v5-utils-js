import { Provider } from '@ethersproject/providers';

import { getRpcClaimedPrizes } from '../utils/getRpcClaimedPrizes.js';
import { ContractsBlob, Claim } from '../types.js';

/**
 * Sets a claimed boolean on an array of claims provided if they have already been claimed
 * uses RPC calls to provider as the source of truth for previous claim data
 *
 * @param {readProvider} Provider
 * @param {contracts} ContractsBlob
 * @param {claims} Claim[]
 *
 * @returns {Promise} Promise of an array of Claim objects (with claimed flags)
 */
export const flagClaimedRpc = async (
  readProvider: Provider,
  contracts: ContractsBlob,
  claims: Claim[],
): Promise<Claim[]> => {
  const claimedPrizes: string[] = await getRpcClaimedPrizes(readProvider, contracts, claims);

  for (let claim of claims) {
    claim.claimed = claimedPrizes.includes(rpcClaimCompositeKey(claim));
  }

  return claims;
};

const rpcClaimCompositeKey = (claim: Claim) =>
  `${claim.vault}-${claim.winner}-${claim.tier}-${claim.prizeIndex}`;
