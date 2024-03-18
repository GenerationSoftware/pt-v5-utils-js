import { gql } from 'graphql-request';

import { getSubgraphClient } from './getSubgraphClient.js';
import { PrizeVault } from '../types.js';

const GRAPH_QUERY_PAGE_SIZE = 1000;

/**
 * Pulls from the subgraph all of the prize vaults
 *
 * @returns {Promise} Promise of an array of PrizeVault objects
 */
export const getSubgraphPrizeVaults = async (chainId: number): Promise<PrizeVault[]> => {
  const client = getSubgraphClient(chainId);

  const query = prizeVaultsQuery();

  // @ts-ignore: ignore types from GraphQL client lib
  const prizeVaultsResponse: any = await client.request(query).catch((e) => {
    console.error(e.message);
    throw e;
  });

  return prizeVaultsResponse?.prizeVaults || [];
};

/**
 * Pulls from the subgraph all of the accounts associated with the provided prize vaults
 *
 * @returns {Promise} Promise of an array of Vault objects
 */

// For beforeTimestamp don't use milliseconds!
// ie. 1710450345 or 1710457517, but not 1710457517000
//
export const populateSubgraphPrizeVaultAccounts = async (
  chainId: number,
  prizeVaults: PrizeVault[],
  beforeTimestamp?: number,
): Promise<PrizeVault[]> => {
  const client = getSubgraphClient(chainId);

  for (let i = 0; i < prizeVaults.length; i++) {
    const prizeVault = prizeVaults[i];
    const prizeVaultAddress = prizeVault.id;

    let query = prizeVaultAccountsQuery();

    if (!!beforeTimestamp) {
      query = prizeVaultAccountsIncludingBalanceBeforeTimestampQuery();
    }

    if (!prizeVault.accounts) {
      prizeVault.accounts = [];
    }

    let lastId = '';
    while (true) {
      const variables: any = {
        prizeVaultAddress,
        first: GRAPH_QUERY_PAGE_SIZE,
        lastId,
      };

      if (!!beforeTimestamp) {
        variables.beforeTimestamp = beforeTimestamp;
      }

      // @ts-ignore: ignore types from GraphQL client lib
      const accountsResponse: any = await client.request(query, variables).catch((e) => {
        console.error(e.message);
        throw e;
      });
      const accounts = accountsResponse?.accounts || [];

      if (!!beforeTimestamp) {
        const accountsWithBalance = accounts.filter((account: any) => {
          return account.balanceUpdatesBeforeTimestamp?.[0]?.delegateBalance > Number(0);
        });

        prizeVault.accounts = prizeVault.accounts.concat(accountsWithBalance);
      } else {
        prizeVault.accounts = prizeVault.accounts.concat(accounts);
      }

      const numberOfResults = accounts.length;
      if (numberOfResults < GRAPH_QUERY_PAGE_SIZE) {
        break;
      }

      lastId = accounts[accounts.length - 1].id;
    }
  }

  return prizeVaults;
};

const prizeVaultsQuery = () => {
  return gql`
    {
      prizeVaults {
        id
      }
    }
  `;
};

const prizeVaultAccountsQuery = () => {
  return gql`
    query drawQuery($first: Int!, $lastId: String, $prizeVaultAddress: String!) {
      accounts(first: $first, where: { id_gt: $lastId, prizeVault_: { id: $prizeVaultAddress } }) {
        id
        user {
          address
        }
      }
    }
  `;
};

const prizeVaultAccountsIncludingBalanceBeforeTimestampQuery = () => {
  return gql`
    query drawQuery(
      $first: Int!
      $lastId: String
      $prizeVaultAddress: String!
      $beforeTimestamp: Int!
    ) {
      accounts(first: $first, where: { id_gt: $lastId, prizeVault_: { id: $prizeVaultAddress } }) {
        id
        user {
          address
        }

        balanceUpdatesBeforeTimestamp: balanceUpdates(
          orderBy: timestamp
          orderDirection: desc
          first: 1
          where: { timestamp_lte: $beforeTimestamp }
        ) {
          delegateBalance
        }
      }
    }
  `;
};
