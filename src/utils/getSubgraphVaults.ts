import { gql } from 'graphql-request';

import { getSubgraphClient } from './getSubgraphClient';
import { ContractVersion, Vault } from '../types';

const GRAPH_QUERY_PAGE_SIZE = 1000;

/**
 * Pulls from the subgraph all of the vaults
 *
 * @returns {Promise} Promise of an array of Vault objects
 */
export const getSubgraphVaults = async (
  chainId: number,
  version: ContractVersion,
): Promise<Vault[]> => {
  const client = getSubgraphClient(chainId, version);

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
  version: ContractVersion,
  vaults: Vault[],
): Promise<Vault[]> => {
  const client = getSubgraphClient(chainId, version);

  for (let i = 0; i < vaults.length; i++) {
    const vault = vaults[i];
    const vaultAddress = vault.id;
    const query = vaultAccountsQuery();

    if (!vault.accounts) {
      vault.accounts = [];
    }

    let lastId = '';
    while (true) {
      const variables = {
        vaultAddress,
        first: GRAPH_QUERY_PAGE_SIZE,
        lastId,
      };

      // @ts-ignore: ignore types from GraphQL client lib
      const accountsResponse: any = await client.request(query, variables).catch((e) => {
        console.error(e.message);
        throw e;
      });
      const newAccounts = accountsResponse?.accounts || [];

      vault.accounts = vault.accounts.concat(newAccounts);

      const numberOfResults = newAccounts.length;
      if (numberOfResults < GRAPH_QUERY_PAGE_SIZE) {
        break;
      }

      lastId = newAccounts[newAccounts.length - 1].id;
    }
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
    query drawQuery($first: Int!, $lastId: String, $vaultAddress: String!) {
      accounts(first: $first, where: { id_gt: $lastId, vault_: { id: $vaultAddress } }) {
        id
        user {
          address
        }
      }
    }
  `;
};
