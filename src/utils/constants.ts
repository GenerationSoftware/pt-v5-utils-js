export const CHAIN_IDS: Record<string, number> = {
  mainnet: 1,
  optimism: 10,
  arbitrum: 42161,
  arbitrumSepolia: 421614,
  sepolia: 11155111,
  optimismSepolia: 11155420,
};

export const CONTRACTS_STORE: Record<string, string> = {
  [CHAIN_IDS.mainnet]: '',
  [CHAIN_IDS.optimism]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/d025f4d37bb536ad083bcc4de1ac4d3c84523b48/deployments/optimism/contracts.json', // v50, will be updated to v51 soon!
  [CHAIN_IDS.sepolia]: '',
  [CHAIN_IDS.optimismSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/5fd73635ce5da1aacc1b263825fd022d3060359d/deployments/optimismSepolia/contracts.json',
};

export const SUBGRAPH_URIS: Record<string, string> = {
  [CHAIN_IDS.optimism]:
    'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest?source=pooltogether', // ?source=pooltogether
  [CHAIN_IDS.sepolia]: '',
  [CHAIN_IDS.optimismSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
};
