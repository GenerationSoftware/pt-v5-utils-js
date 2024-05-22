import { GraphQLClient } from 'graphql-request';

/**
 * Initializes and returns a GraphQLClient instance to work with set to
 * the contractJsonUrl provided
 *
 * @param {contractJsonUrl} string
 *
 * @returns {GraphQLClient} GraphQLClient
 */
export const getSubgraphClient = (subgraphUrl: string, fetch?: any): GraphQLClient => {
  return new GraphQLClient(subgraphUrl, {
    fetch,
  });
};
