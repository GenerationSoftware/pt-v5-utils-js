import { gql, GraphQLClient } from 'graphql-request';

import { TWAB_CONTROLLER_SUBGRAPH_URIS } from './constants';
import { Vault, VaultAccount } from '../types';

const GRAPH_QUERY_PAGE_SIZE = 1000;

/**
 * Subgraphs to query for depositors
 */
export const getTwabControllerSubgraphUri = (chainId: number) => {
  return TWAB_CONTROLLER_SUBGRAPH_URIS[chainId];
};

export const getTwabControllerSubgraphClient = (chainId: number) => {
  const uri = getTwabControllerSubgraphUri(chainId);

  return new GraphQLClient(uri);
};

/**
 * Pulls from the subgraph all of the vaults
 *
 * @returns {Promise} Promise of an array of Vault objects
 */
export const getSubgraphVaults = async (chainId: number): Promise<Vault[]> => {
  const client = getTwabControllerSubgraphClient(chainId);

  const query = vaultsQuery();

  // @ts-ignore: ignore types from GraphQL client lib
  const vaultsResponse: any = await client.request(query).catch((e) => {
    console.error(e.message);
    throw e;
  });

  return vaultsResponse?.vaults || [];
};

/**
 * Pulls from the subgraph all of the accounts associated with the provided vaults
 *
 * @returns {Promise} Promise of an array of Vault objects
 */
export const populateSubgraphVaultAccounts = async (
  chainId: number,
  vaults: Vault[],
): Promise<Vault[]> => {
  const client = getTwabControllerSubgraphClient(chainId);

  for (let i = 0; i < vaults.length; i++) {
    const vault = vaults[i];
    const vaultAddress = vault.id;
    const query = vaultAccountsQuery();

    const variables = {
      vaultAddress,
      // first: GRAPH_QUERY_PAGE_SIZE,
      // lastId: lastId || '',
    };

    // @ts-ignore: ignore types from GraphQL client lib
    const accountsResponse: any = await client.request(query, variables).catch((e) => {
      console.error(e.message);
      throw e;
    });

    if (!vault.accounts) {
      vault.accounts = [];
    }

    vault.accounts = vault.accounts.concat(accountsResponse?.accounts || []);
  }

  return vaults;
};

const vaultsQuery = () => {
  return gql`
    {
      vaults {
        id
      }
    }
  `;
};

const vaultAccountsQuery = () => {
  return gql`
    query drawQuery($vaultAddress: String!) {
      accounts(where: { vault_: { id: $vaultAddress } }, first: 1000) {
        id
      }
    }
  `;
};
