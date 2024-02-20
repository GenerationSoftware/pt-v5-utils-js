import { GraphQLClient } from 'graphql-request';

import { SUBGRAPH_URIS } from './constants';

/**
 * Subgraphs to query for depositors
 */
export const getSubgraphUri = (chainId: number): string => {
  return SUBGRAPH_URIS[chainId];
};

export const getSubgraphClient = (chainId: number, fetch?: any): GraphQLClient => {
  const uri = getSubgraphUri(chainId);

  return new GraphQLClient(uri, {
    fetch,
  });
};
