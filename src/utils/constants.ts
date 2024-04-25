export const CHAIN_IDS: Record<string, number> = {
  mainnet: 1,
  optimism: 10,
  arbitrum: 42161,
  arbitrumSepolia: 421614,
  sepolia: 11155111,
  optimismSepolia: 11155420,
};

export const CONTRACTS_STORE: Record<string, string> = {
  [CHAIN_IDS.optimism]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/396f04daedc5a38935460ddf47d2f10e9ac1fec6/deployments/optimism/contracts.json',
  [CHAIN_IDS.optimismSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/993c1f75b8b19826195f44c197be6928a213863d/deployments/optimismSepolia/contracts.json',
  [CHAIN_IDS.baseSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/fe26460a82048f8b0234efcad6c9dc82901890db/deployments/optimismSepolia/contracts.json',
};

export const SUBGRAPH_URIS: Record<string, string> = {
  [CHAIN_IDS.optimism]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-optimism/version/latest?source=pooltogether', // ?source=pooltogether
  [CHAIN_IDS.optimismSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
  [CHAIN_IDS.baseSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-base-sepolia/version/latest',
};
