import { ethers, BigNumber } from 'ethers';
import { Provider } from '@ethersproject/providers';

import { ContractsBlob, PrizePoolInfo, TierPrizeData } from '../types.js';
import { findPrizePoolInContracts } from '../utils/index.js';
import { getEthersMulticallProviderResults } from './multicall.js';

import ethersMulticallProviderPkg from 'ethers-multicall-provider';
const { MulticallWrapper } = ethersMulticallProviderPkg;

const KEYS = {
  drawPeriodSeconds: 'drawPeriodSeconds',
  grandPrizePeriodDraws: 'grandPrizePeriodDraws',
  isDrawFinalized: 'isDrawFinalized',
  lastDrawClosedAt: 'lastDrawClosedAt',
  numTiers: 'numTiers',
  reserve: 'reserve',
} as const;

const tierPrizeCountKey = (tierNum: number) => `tier-${tierNum}-getTierPrizeCount`;
const tierAmountKey = (tierNum: number) => `tier-${tierNum}-amount`;
const tierLiquidityKey = (tierNum: number) => `tier-${tierNum}-liquidity`;

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
  let prizePoolInfo: PrizePoolInfo = {
    drawId: -1,
    drawPeriodSeconds: -1,
    grandPrizePeriodDraws: -1,
    numPrizeIndices: -1,
    numTiers: -1,
    lastDrawClosedAt: -1,
    reserve: '',
    tiersRangeArray: [],
    tierPrizeData: {},
    isDrawFinalized: false,
  };

  const prizePoolContractBlob = findPrizePoolInContracts(contracts);
  const prizePoolAddress: string | undefined = prizePoolContractBlob?.address;

  // @ts-ignore Provider == BaseProvider
  const multicallProvider = MulticallWrapper.wrap(readProvider);

  // @ts-ignore Provider == BaseProvider
  const prizePoolContract = new ethers.Contract(
    prizePoolAddress,
    prizePoolContractBlob.abi,
    multicallProvider,
  );

  let queriesOne: Record<string, any> = {};

  // Draw ID
  prizePoolInfo.drawId = await prizePoolContract.getLastAwardedDrawId();

  queriesOne[KEYS.isDrawFinalized] = prizePoolContract.isDrawFinalized(prizePoolInfo.drawId);
  queriesOne[KEYS.lastDrawClosedAt] = prizePoolContract.drawClosesAt(prizePoolInfo.drawId);

  // Draw Period in Seconds
  queriesOne[KEYS.drawPeriodSeconds] = prizePoolContract.drawPeriodSeconds();

  // Max # of Periods between Grand Prizes
  queriesOne[KEYS.grandPrizePeriodDraws] = prizePoolContract.grandPrizePeriodDraws();

  // Number of Tiers
  queriesOne[KEYS.numTiers] = prizePoolContract.numberOfTiers();

  // Prize Pool Reserve
  queriesOne[KEYS.reserve] = prizePoolContract.reserve();

  const resultsOne = await getEthersMulticallProviderResults(multicallProvider, queriesOne);

  prizePoolInfo.isDrawFinalized = resultsOne[KEYS.isDrawFinalized];
  prizePoolInfo.lastDrawClosedAt = resultsOne[KEYS.lastDrawClosedAt];
  prizePoolInfo.drawPeriodSeconds = resultsOne[KEYS.drawPeriodSeconds];
  prizePoolInfo.grandPrizePeriodDraws = resultsOne[KEYS.grandPrizePeriodDraws];
  prizePoolInfo.numTiers = resultsOne[KEYS.numTiers];
  prizePoolInfo.reserve = resultsOne[KEYS.reserve].toString();

  // Tiers Range Array
  const tiersRangeArray = Array.from({ length: prizePoolInfo.numTiers }, (value, index) => index);
  prizePoolInfo.tiersRangeArray = tiersRangeArray;

  let queriesTwo: Record<string, any> = {};

  // Tier Data Queries
  for (let tierNum = 0; tierNum < prizePoolInfo.numTiers; tierNum++) {
    queriesTwo[tierPrizeCountKey(tierNum)] =
      prizePoolContract.functions['getTierPrizeCount(uint8)'](tierNum);
    queriesTwo[tierAmountKey(tierNum)] = prizePoolContract.getTierPrizeSize(tierNum);
    queriesTwo[tierLiquidityKey(tierNum)] = prizePoolContract.getTierRemainingLiquidity(tierNum);
  }

  const resultsTwo = await getEthersMulticallProviderResults(multicallProvider, queriesTwo);

  // Tier Data Results
  for (let tierNum = 0; tierNum < prizePoolInfo.numTiers; tierNum++) {
    const tier: TierPrizeData = (prizePoolInfo.tierPrizeData[tierNum.toString()] = {
      prizeIndicesCount: -1,
      prizeIndicesRangeArray: [],
      amount: BigNumber.from(0),
      liquidity: BigNumber.from(0),
    });

    tier.prizeIndicesCount = resultsTwo[`tier-${tierNum}-getTierPrizeCount`][0];

    // Prize Indices Range Array
    tier.prizeIndicesRangeArray = buildPrizeIndicesRangeArray(tier);

    // Prize Amount
    tier.amount = resultsTwo[`tier-${tierNum}-amount`];

    // Prize Liquidity
    tier.liquidity = resultsTwo[`tier-${tierNum}-liquidity`];
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
