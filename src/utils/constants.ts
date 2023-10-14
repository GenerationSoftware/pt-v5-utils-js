const CHAIN_ID = {
  goerli: 5,
  optimism: 10,
  optimismGoerli: 420,
};

interface StringMap {
  [key: string]: string;
}

export const CONTRACTS_STORE: StringMap = {
  '1': 'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/main/deployments/ethereum/contracts.json',
  '5': 'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/prod-testnet-2/deployments/ethGoerli/contracts.json',
  '10': 'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-mainnet/main/deployments/optimism/contracts.json',
  '420':
    'https://raw.githubusercontent.com/GenerationSoftware/pt-v5-testnet/prod-testnet-2/deployments/optimismGoerli/contracts.json',
};

export const TWAB_CONTROLLER_SUBGRAPH_URIS = {
  [CHAIN_ID.optimismGoerli]: `https://api.studio.thegraph.com/query/50959/pt-v5-op-goerli/version/latest`,
};

export const PRIZE_POOL_SUBGRAPH_URIS = {
  [CHAIN_ID.optimismGoerli]: `https://api.studio.thegraph.com/query/50959/pt-v5-op-goerli/version/latest`,
};
