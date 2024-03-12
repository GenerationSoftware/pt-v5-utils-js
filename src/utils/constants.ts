export const CHAIN_IDS: Record<string, number> = {
  mainnet: 1,
  optimism: 10,
  optimismGoerli: 420,
  arbitrum: 42161,
  arbitrumGoerli: 421613,
  arbitrumSepolia: 421614,
  sepolia: 11155111,
  optimismSepolia: 11155420,
};

export const CONTRACTS_STORE: Record<string, string> = {
  [CHAIN_IDS.mainnet]: '',
  [CHAIN_IDS.optimism]: '',
  [CHAIN_IDS.sepolia]: '',
  [CHAIN_IDS.optimismGoerli]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/21c33e351b51aa43689fff6847d48333090aecb0/deployments/optimismGoerli/contracts.json',
  [CHAIN_IDS.optimismSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/b386c7fd06c7bb36b16daea254f8189bed861943/deployments/optimismSepolia/contracts.json',
};

export const SUBGRAPH_URIS: Record<string, string> = {
  [CHAIN_IDS.optimism]: '', // ?source=pooltogether
  [CHAIN_IDS.sepolia]: '',
  [CHAIN_IDS.optimismGoerli]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-goerli-new/v0.0.7',
  [CHAIN_IDS.optimismSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
};
