import { Provider } from '@ethersproject/providers';

import {
  getSubgraphPrizeVaults,
  populateSubgraphPrizeVaultAccounts,
} from '../utils/getSubgraphPrizeVaults';
import { getWinnersClaims } from '../utils/getWinnersClaims';
import { getPrizePoolInfo } from '../utils/getPrizePoolInfo';
import { flagClaimedRpc } from '../utils/flagClaimedRpc';
import { ContractVersion, ContractsBlob, Claim, PrizePoolInfo } from '../types';

/**
 * Finds out which of the accounts in each vault are winners for the last draw and formats
 * them into an array Claim objects
 *
 * @returns {Promise} Promise of an array of Claim objects
 */
export async function computeDrawWinners(
  readProvider: Provider,
  contracts: ContractsBlob,
  chainId: number,
  version: ContractVersion,
): Promise<Claim[]> {
  // #1. Collect prize pool info
  const prizePoolInfo: PrizePoolInfo = await getPrizePoolInfo(readProvider, contracts);

  // #2. Collect all vaults
  let vaults = await getSubgraphPrizeVaults(chainId, version);
  if (vaults.length === 0) {
    throw new Error('Claimer: No vaults found in subgraph');
  }

  // #3. Page through and concat all accounts for all vaults
  vaults = await populateSubgraphPrizeVaultAccounts(chainId, version, vaults);

  // #4. Determine winners for last draw
  let claims: Claim[] = await getWinnersClaims(readProvider, prizePoolInfo, contracts, vaults);

  // #5. Cross-reference prizes claimed subgraph to flag if a claim has been claimed or not
  claims = await flagClaimedRpc(readProvider, contracts, claims);

  return claims;
}
