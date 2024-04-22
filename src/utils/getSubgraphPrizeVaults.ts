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
 * @param chainId chainId as number
 * @param prizeVaults array of PrizeVault objects to populate
 * @param afterTimestamp (optional) the timestamp to query for depositors after
 * @param beforeTimestamp (optional) the timestamp to query for depositors before
 * @returns {Promise} Promise of an array of Vault objects
 */
export const populateSubgraphPrizeVaultAccounts = async (
  chainId: number,
  prizeVaults: PrizeVault[],
  afterTimestamp?: number,
  beforeTimestamp?: number,
): Promise<PrizeVault[]> => {
  const client = getSubgraphClient(chainId);

  for (let i = 0; i < prizeVaults.length; i++) {
    const prizeVault = prizeVaults[i];
    const prizeVaultAddress = prizeVault.id;

    let query = prizeVaultAccountsQuery();

    if (!!afterTimestamp && !!beforeTimestamp) {
      query = prizeVaultAccountsIncludingBalanceBeforeTimestampQuery();
    } else if (!!afterTimestamp || !!beforeTimestamp) {
      throw new Error(
        `Both the 'afterTimestamp' and the 'beforeTimestamp' need to be included or left blank`,
      );
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

      // Note: For beforeTimestamp don't use milliseconds!
      // ie. 1710450345 or 1710457517, but not 1710457517000
      if (!!afterTimestamp && !!beforeTimestamp) {
        if (afterTimestamp > beforeTimestamp) {
          throw new Error(`'afterTimestamp' cannot be greater than the 'beforeTimestamp'`);
        }

        variables.afterTimestamp = afterTimestamp;
        variables.beforeTimestamp = beforeTimestamp;
      }

      // @ts-ignore: ignore types from GraphQL client lib
      const accountsResponse: any = await client.request(query, variables).catch((e) => {
        console.error(e.message);
        throw e;
      });
      const accounts = accountsResponse?.accounts || [];

      if (!!afterTimestamp && !!beforeTimestamp) {
        const accountsWithBalance = accounts.filter((account: any) => {
          return (
            account.balanceUpdatesAfterTimestamp?.[0]?.delegateBalance > Number(0) ||
            account.balanceUpdatesBeforeTimestamp?.[0]?.delegateBalance > Number(0)
          );
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
      $afterTimestamp: Int!
      $beforeTimestamp: Int!
    ) {
      accounts(first: $first, where: { id_gt: $lastId, prizeVault_: { id: $prizeVaultAddress } }) {
        id
        user {
          address
        }

        balanceUpdatesAfterTimestamp: balanceUpdates(
          orderBy: timestamp
          orderDirection: desc
          first: 1
          where: { timestamp_gte: $afterTimestamp }
        ) {
          delegateBalance
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
