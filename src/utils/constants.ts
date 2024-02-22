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
  [CHAIN_IDS.optimismGoerli]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/389e9dd64c4e944ff25d68a9f17df27f560ca1ac/deployments/optimismGoerli/contracts.json',
  [CHAIN_IDS.optimismSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/547fdad54e9fd67b008997658467688a515e2524/deployments/optimismSepolia/contracts.json',
};

export const SUBGRAPH_URIS: Record<string, string> = {
  [CHAIN_IDS.optimism]: '',
  [CHAIN_IDS.optimismGoerli]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-goerli-new/version/latest',
  [CHAIN_IDS.optimismSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
};
