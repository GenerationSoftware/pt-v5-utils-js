import { ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { MulticallWrapper } from 'ethers-multicall-provider';
import * as _ from 'lodash';

import {
  Claim,
  ContractsBlob,
  PrizeVault,
  PrizeVaultAccount,
  PrizePoolInfo,
  TierPrizeData,
} from '../types';
import { findPrizePoolInContracts } from '../utils';
import { getEthersMulticallProviderResults } from './multicall';

const CHUNK_MIN_SIZE = 8;
const CHUNK_MAX_SIZE = 300;
const CHUNK_CONSTANT_FACTOR = 20000;
const CHUNK_DAMPING_FACTOR = 1.5;

/**
 * Returns claims
 * @param readProvider a read-capable provider for the chain that should be queried
 * @param contracts blob of contracts to pull PrizePool abi/etc from
 * @param vaults vaults to query through
 * @returns
 */
export const getWinnersClaims = async (
  readProvider: Provider,
  prizePoolInfo: PrizePoolInfo,
  contracts: ContractsBlob,
  vaults: PrizeVault[],
): Promise<Claim[]> => {
  const prizePoolContractBlob = findPrizePoolInContracts(contracts);
  const prizePoolAddress: string | undefined = prizePoolContractBlob?.address;

  // @ts-ignore Provider == BaseProvider
  const multicallProvider = MulticallWrapper.wrap(readProvider);
  const prizePoolContract = new ethers.Contract(
    prizePoolAddress,
    prizePoolContractBlob.abi,
    multicallProvider,
  );

  let queries: Record<string, any> = {};

  console.log('');
  console.log(`${prizePoolInfo.tiersRangeArray.length} tiers.`);

  // OPTIMIZE: Make sure user has balance before adding them to the read multicall
  for (let vault of vaults) {
    console.log('');
    console.log('# Processing vault:', vault.id);
    let toQuery: Record<string, any> = {};

    console.log(`${vault.accounts.length} accounts.`);

    // chunking optimization for memory and rpc load calls
    const chunkSize = calculateChunkSize(prizePoolInfo.numPrizeIndices);
    const vaultAccountArrays = splitArray(vault.accounts, chunkSize);

    for (let vaultAccountArray of vaultAccountArrays) {
      for (let account of vaultAccountArray) {
        const address = account.user.address;

        for (let tierNum of prizePoolInfo.tiersRangeArray) {
          const tier: TierPrizeData = prizePoolInfo.tierPrizeData[tierNum];
          // console.log(`${tier.prizeIndicesCount} prizes for tier ${tierNum}.`);

          for (let prizeIndex of tier.prizeIndicesRangeArray) {
            const key = `${vault.id}-${address}-${tierNum}-${prizeIndex}`;
            toQuery[key] = prizePoolContract.isWinner(vault.id, address, tierNum, prizeIndex);
          }
        }
      }

      console.log('toQuery count:', Object.keys(toQuery).length);

      const results = await getEthersMulticallProviderResults(multicallProvider, toQuery);
      queries = { ...queries, ...results };
    }
  }

  console.log('');
  console.log('');
  console.log('Total # of Queries:');
  console.log(Object.values(queries).length);

  // Builds the array of claims
  const claims = getClaims(queries);

  return claims;
};

const getClaims = (queries: Record<string, any>): Claim[] => {
  // Filter to only 'true' results of isWinner() calls
  const filteredWinners = _.pickBy(queries, (object) => !!object);

  // Push to claims array
  const claims: Claim[] = Object.keys(filteredWinners).map((vaultUserTierResult) => {
    const [vault, winner, tier, prizeIndex] = vaultUserTierResult.split('-');

    return { vault, winner, tier: Number(tier), prizeIndex: Number(prizeIndex) };
  });

  return claims;
};

const splitArray = function (array: PrizeVaultAccount[], size: number) {
  let array2 = array.slice(0),
    arrays = [];

  while (array2.length > 0) {
    arrays.push(array2.splice(0, size));
  }

  return arrays;
};

// If there are less prize indices we want a larger chunk size, this will reduce the # of RPC network calls
// and make more efficient use of CPU & RAM
const calculateChunkSize = (numPrizeIndices: number) => {
  const chunkSize = Math.pow(CHUNK_CONSTANT_FACTOR / numPrizeIndices, 1 / CHUNK_DAMPING_FACTOR);

  return Math.ceil(Math.min(CHUNK_MAX_SIZE, Math.max(CHUNK_MIN_SIZE, chunkSize)));
};
