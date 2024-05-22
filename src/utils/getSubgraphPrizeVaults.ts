import { gql } from 'graphql-request';

import { getSubgraphClient } from './getSubgraphClient.js';
import { PrizeVault } from '../types.js';

const GRAPH_QUERY_PAGE_SIZE = 1000;

/**
 * Pulls from the subgraph all of the prize vaults
 *
 * @param {subgraphUrl} string API URL of the subgraph to use
 *
 * @returns {Promise} Promise of an array of PrizeVault objects
 */
export const getSubgraphPrizeVaults = async (subgraphUrl: string): Promise<PrizeVault[]> => {
  const client = getSubgraphClient(subgraphUrl);

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
 * @param subgraphUrl API URL of the subgraph to use
 * @param prizeVaults array of PrizeVault objects to populate
 * @param startTimestamp (optional) the timestamp to query for depositors after
 * @param endTimestamp (optional) the timestamp to query for depositors before
 *
 * @returns {Promise} Promise of an array of Vault objects
 */
export const populateSubgraphPrizeVaultAccounts = async (
  subgraphUrl: string,
  prizeVaults: PrizeVault[],
  startTimestamp?: number,
  endTimestamp?: number,
): Promise<PrizeVault[]> => {
  const client = getSubgraphClient(subgraphUrl);

  for (let i = 0; i < prizeVaults.length; i++) {
    const prizeVault = prizeVaults[i];
    const prizeVaultAddress = prizeVault.id;

    let query = prizeVaultAccountsQuery();

    if (!!startTimestamp && !!endTimestamp) {
      query = prizeVaultAccountsIncludingBalanceUpdatesQuery();
    } else if (!!startTimestamp || !!endTimestamp) {
      throw new Error(
        `Both the 'startTimestamp' and the 'endTimestamp' need to be included or left blank`,
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

      // Note: For endTimestamp don't use milliseconds!
      // ie. 1710450345 or 1710457517, but not 1710457517000
      if (!!startTimestamp && !!endTimestamp) {
        if (startTimestamp > endTimestamp) {
          throw new Error(`'startTimestamp' cannot be greater than the 'endTimestamp'`);
        }

        variables.startTimestamp = startTimestamp;
        variables.endTimestamp = endTimestamp;
      }

      // @ts-ignore: ignore types from GraphQL client lib
      const accountsResponse: any = await client.request(query, variables).catch((e) => {
        console.error(e.message);
        throw e;
      });
      const accounts = accountsResponse?.accounts || [];

      if (!!startTimestamp && !!endTimestamp) {
        const accountsWithBalance = filterAccountsWithBalance(accounts);

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

const filterAccountsWithBalance = (accounts: any[]) => {
  return accounts.filter((account: any) => {
    const balanceUpdatesAboveZeroDuringRange = account.balanceUpdatesBetweenMaxDrawPeriod.filter(
      (update: any) => {
        return update.delegateBalance > 0;
      },
    );

    return (
      account.mostRecentBalanceUpdateBeforeTimestamp?.[0]?.delegateBalance > 0 ||
      balanceUpdatesAboveZeroDuringRange.length > 0
    );
  });
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

const prizeVaultAccountsIncludingBalanceUpdatesQuery = () => {
  return gql`
    query drawQuery(
      $first: Int!
      $lastId: String
      $prizeVaultAddress: String!
      $startTimestamp: Int!
      $endTimestamp: Int!
    ) {
      accounts(first: $first, where: { id_gt: $lastId, prizeVault_: { id: $prizeVaultAddress } }) {
        id
        user {
          address
        }
        delegateBalance

        mostRecentBalanceUpdateBeforeTimestamp: balanceUpdates(
          orderBy: timestamp
          orderDirection: desc
          first: 1
          where: { timestamp_lte: $startTimestamp }
        ) {
          delegateBalance
        }

        balanceUpdatesBetweenMaxDrawPeriod: balanceUpdates(
          where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp }
        ) {
          delegateBalance
        }
      }
    }
  `;
};
