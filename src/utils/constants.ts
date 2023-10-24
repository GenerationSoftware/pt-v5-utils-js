const CHAIN_ID = {
  goerli: 5,
  optimism: 10,
  optimismGoerli: 420,
};

interface StringMap {
  [key: string]: string;
}

export const CONTRACTS_STORE: StringMap = {
  '1': 'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/a1b2e242447006908ab43ddd922540a04de8cb44/deployments/ethereum/contracts.json',
  '5': 'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/prod-testnet-3/deployments/ethGoerli/contracts.json',
  '10': 'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/50a56ede71b3e9f4a2ba3bc6a8ae48360f70aa86/deployments/optimism/contracts.json',
  '420':
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/prod-testnet-3/deployments/optimismGoerli/contracts.json',
};

export const SUBGRAPH_URIS = {
  [CHAIN_ID.optimism]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op/version/latest',
  [CHAIN_ID.optimismGoerli]: 'https://api.studio.thegraph.com/query/50959/pt-v5-op-goerli/v0.0.22',
};
