import { VersionedStringMap, NumberMap } from '../types';

export const CHAIN_IDS: NumberMap = {
  mainnet: 1,
  optimism: 10,
  arbitrum: 42161,
  arbitrumGoerli: 421613,
  arbitrumSepolia: 421614,
  sepolia: 11155111,
  optimismSepolia: 11155420,
};

export const CONTRACTS_STORE: VersionedStringMap = {
  v50: {
    [CHAIN_IDS.mainnet]:
      'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/a1b2e242447006908ab43ddd922540a04de8cb44/deployments/ethereum/contracts.json',
    [CHAIN_IDS.optimism]:
      'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/50a56ede71b3e9f4a2ba3bc6a8ae48360f70aa86/deployments/optimism/contracts.json',
    [CHAIN_IDS.sepolia]:
      'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/51adf597e5e8d562ace2c0b2d030a69736a59957/deployments/ethSepolia/contracts.json',
    [CHAIN_IDS.arbitrumSepolia]:
      'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/51adf597e5e8d562ace2c0b2d030a69736a59957/deployments/arbitrumSepolia/contracts.json',
    [CHAIN_IDS.optimismSepolia]:
      'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/d44412f6392888a3a1e9f16fca93e2de45f85033/deployments/optimismSepolia/contracts.json',
  },
  v51: {
    [CHAIN_IDS.optimism]: '',
    [CHAIN_IDS.optimismSepolia]:
      'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/547fdad54e9fd67b008997658467688a515e2524/deployments/optimismSepolia/contracts.json',
  },
};

export const SUBGRAPH_URIS: VersionedStringMap = {
  v50: {
    [CHAIN_IDS.optimism]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest',
    [CHAIN_IDS.sepolia]:
      'https://api.studio.thegraph.com/query/50959/pt-v5-eth-sepolia/version/latest',
    [CHAIN_IDS.arbitrumSepolia]:
      'https://api.thegraph.com/subgraphs/name/chuckbergeron/pt-v5-arb-sepolia', // note: hosted, switch to studio/decentralized when it's ready
    [CHAIN_IDS.optimismSepolia]:
      'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
  },
  v51: {
    [CHAIN_IDS.optimism]: '',
    [CHAIN_IDS.optimismSepolia]:
      'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
  },
};
