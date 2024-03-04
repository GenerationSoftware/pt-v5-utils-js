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
  [CHAIN_IDS.sepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/21c33e351b51aa43689fff6847d48333090aecb0/deployments/sepolia/contracts.json',
  [CHAIN_IDS.optimismGoerli]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/0b0583efcdd2b792df2b05f1530431a30b7295c7/deployments/optimismGoerli/contracts.json',
  [CHAIN_IDS.optimismSepolia]:
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/547fdad54e9fd67b008997658467688a515e2524/deployments/optimismSepolia/contracts.json',
};

export const SUBGRAPH_URIS: Record<string, string> = {
  [CHAIN_IDS.optimism]: '',
  [CHAIN_IDS.sepolia]: 'https://api.studio.thegraph.com/query/63100/pt-v5-sepolia/version/latest',
  [CHAIN_IDS.optimismGoerli]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-goerli-new/version/latest',
  [CHAIN_IDS.optimismSepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
};
