import { ethers, BigNumber } from 'ethers';
import { Provider } from '@ethersproject/providers';

import { ContractsBlob, PrizePoolInfo, TierPrizeData } from '../types';
import { findPrizePoolInContracts } from '../utils';

// OPTIMIZE: Could use multicall reads here
/**
 * Gather information about the given prize pool's previous drawId and tiers
 * @param readProvider a read-capable provider for the chain that should be queried
 * @param contracts blob of contracts to pull PrizePool abi/etc from
 * @returns {Promise} Promise with PrizePoolInfo
 */
export const getPrizePoolInfo = async (
  readProvider: Provider,
  contracts: ContractsBlob,
): Promise<PrizePoolInfo> => {
  const prizePoolInfo: PrizePoolInfo = {
    drawId: -1,
    numPrizeIndices: -1,
    numTiers: -1,
    reserve: '',
    tiersRangeArray: [],
    tierPrizeData: {},
  };

  const prizePoolContractBlob = findPrizePoolInContracts(contracts);
  const prizePoolAddress: string | undefined = prizePoolContractBlob?.address;

  // @ts-ignore Provider == BaseProvider
  const prizePoolContract = new ethers.Contract(
    prizePoolAddress,
    prizePoolContractBlob.abi,
    readProvider,
  );

  // Draw ID
  prizePoolInfo.drawId = await prizePoolContract.getLastAwardedDrawId();

  // Number of Tiers
  prizePoolInfo.numTiers = await prizePoolContract.numberOfTiers();

  // Prize Pool Reserve
  prizePoolInfo.reserve = (await prizePoolContract.reserve()).toString();

  // Tiers Range Array
  const tiersRangeArray = Array.from({ length: prizePoolInfo.numTiers }, (value, index) => index);
  prizePoolInfo.tiersRangeArray = tiersRangeArray;

  // Tier Data
  for (let tierNum = 0; tierNum < prizePoolInfo.numTiers; tierNum++) {
    const tier: TierPrizeData = (prizePoolInfo.tierPrizeData[tierNum.toString()] = {
      prizeIndicesCount: -1,
      prizeIndicesRangeArray: [],
      amount: BigNumber.from(0),
      liquidity: BigNumber.from(0),
    });

    const prizeCount = await prizePoolContract.functions['getTierPrizeCount(uint8)'](tierNum);
    tier.prizeIndicesCount = prizeCount[0];

    // Prize Indices Range Array
    tier.prizeIndicesRangeArray = buildPrizeIndicesRangeArray(tier);

    // Prize Amount
    tier.amount = await prizePoolContract.getTierPrizeSize(tierNum);

    // Prize Liquidity
    tier.liquidity = await prizePoolContract.getTierRemainingLiquidity(tierNum);
  }

  prizePoolInfo.numPrizeIndices = Object.values(prizePoolInfo.tierPrizeData).reduce(
    (accumulator, tierPrize) => tierPrize.prizeIndicesCount + accumulator,
    0,
  );

  return prizePoolInfo;
};

const buildPrizeIndicesRangeArray = (tier: TierPrizeData): number[] => {
  let array: number[] = [];

  const tierPrizeCount = tier.prizeIndicesCount;
  array = Array.from({ length: tierPrizeCount }, (value, index) => index);

  return array;
};
