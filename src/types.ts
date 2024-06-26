import { BigNumber } from 'ethers';

export interface TokenData {
  chainId: number;
  address: string;
  name: string;
  decimals: number;
  symbol: string;
  extensions: {
    underlyingAsset: {
      address: string;
      symbol: string;
      name: string;
    };
  };
}

export interface ContractData {
  address: string;
  chainId: number;
  type: string;
  abi: any;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tokens?: TokenData[];
}

export interface ContractsBlob {
  name: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  timestamp: string;
  contracts: ContractData[];
}

export interface PrizeVault {
  id: string;
  accounts: PrizeVaultAccount[];
}

export interface PrizeVaultAccount {
  id: string;
  user: User;
}

export interface User {
  address: string;
}

export interface Claim {
  vault: string;
  winner: string;
  tier: number;
  prizeIndex: number;
  claimed?: boolean;
}

export interface ClaimedPrize {
  id: string;
  payout: string;
  fee: string;
  timestamp: string;
}

export interface ClaimedPrizeSimple {
  id: string;
}

export interface TierPrizeData {
  prizeIndicesCount: number;
  prizeIndicesRangeArray: number[]; // an easily iterable range of numbers for each tier's prize indices
  amount: BigNumber;
  liquidity: BigNumber;
}

export interface PrizePoolInfo {
  drawId: number;
  isDrawFinalized: boolean; // cannot claim for a draw that has been finalized
  drawPeriodSeconds: number;
  grandPrizePeriodDraws: number;
  numTiers: number;
  numPrizeIndices: number;
  lastDrawClosedAt: number;
  reserve: string;
  tiersRangeArray: number[]; // an easily iterable range of numbers for each tier available (ie. [0, 1, 2])
  tierPrizeData: {
    [tierNum: string]: TierPrizeData;
  };
}
