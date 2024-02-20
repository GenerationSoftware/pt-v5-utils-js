import { getSubgraphClaimedPrizes } from './getSubgraphClaimedPrizes';
import { ClaimedPrize, Claim, PrizePoolInfo } from '../types';

export const flagClaimedSubgraph = async (
  chainId: number,
  claims: Claim[],
  prizePoolInfo: PrizePoolInfo,
): Promise<Claim[]> => {
  const drawId = prizePoolInfo.drawId;
  const claimedPrizes: ClaimedPrize[] = await getSubgraphClaimedPrizes(chainId, drawId);

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
