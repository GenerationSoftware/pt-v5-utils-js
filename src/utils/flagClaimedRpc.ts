import { Provider } from '@ethersproject/providers';

import { getRpcClaimedPrizes } from '../utils/getRpcClaimedPrizes.js';
import { ContractsBlob, Claim } from '../types.js';

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
