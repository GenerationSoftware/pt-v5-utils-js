import { GraphQLClient } from 'graphql-request';
import { ContractVersion } from '../types';

import { SUBGRAPH_URIS } from './constants';

/**
 * Subgraphs to query for depositors
 */
export const getSubgraphUri = (chainId: number, version: ContractVersion): string => {
  return SUBGRAPH_URIS[version][chainId];
};

export const getSubgraphClient = (
  chainId: number,
  version: ContractVersion,
  fetch?: any,
): GraphQLClient => {
  const uri = getSubgraphUri(chainId, version);

  return new GraphQLClient(uri, {
    fetch,
  });
};
