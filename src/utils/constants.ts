export const CHAIN_IDS: Record<string, number> = {
  mainnet: 1,
  optimism: 10,
  arbitrum: 42161,
  arbitrumGoerli: 421613,
  arbitrumSepolia: 421614,
  sepolia: 11155111,
  optimismSepolia: 11155420,
};

export const CONTRACTS_STORE: Record<string, string> = {
  [CHAIN_IDS.mainnet]: '',
  [CHAIN_IDS.optimism]: '',
  [CHAIN_IDS.optimismSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/547fdad54e9fd67b008997658467688a515e2524/deployments/optimismSepolia/contracts.json',
};

export const SUBGRAPH_URIS: Record<string, string> = {
  [CHAIN_IDS.optimism]: '',
  [CHAIN_IDS.optimismSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
};
