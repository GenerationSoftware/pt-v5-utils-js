import { getSubgraphClaimedPrizes } from './getSubgraphClaimedPrizes.js';
import { ClaimedPrize, Claim, PrizePoolInfo } from '../types.js';

/**
 * Sets a claimed boolean on an array of claims provided if they have already been claimed
 * uses the subgraph as the source of truth for previous claim data
 *
 * @param {subgraphUrl} string API URL of the subgraph to use
 * @param {claims} Claim[]
 * @param {prizePoolInfo} PrizePoolInfo
 *
 * @returns {Promise} Promise of an array of Claim objects (with claimed flags)
 */
export const flagClaimedSubgraph = async (
  subgraphUrl: string,
  claims: Claim[],
  prizePoolInfo: PrizePoolInfo,
): Promise<Claim[]> => {
  const drawId = prizePoolInfo.drawId;
  const claimedPrizes: ClaimedPrize[] = await getSubgraphClaimedPrizes(subgraphUrl, drawId);

  const formattedClaimedPrizes = claimedPrizes.map((claimedPrize) => {
    // From Subgraph, `id` is:
    // vault ID + winner ID + draw ID + tier + prizeIndex
    const [vault, winner, draw, tier, prizeIndex] = claimedPrize.id.split('-');
    return `${vault}-${winner}-${tier}-${prizeIndex}`;
  });

  for (let claim of claims) {
    claim.claimed = formattedClaimedPrizes.includes(subgraphClaimCompositeKey(claim));
  }

  return claims;
};

const subgraphClaimCompositeKey = (claim: Claim) =>
  `${claim.vault}-${claim.winner}-${claim.tier}-${claim.prizeIndex}`;
