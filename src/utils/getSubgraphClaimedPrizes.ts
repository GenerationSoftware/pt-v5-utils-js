import { gql } from 'graphql-request';

import { getSubgraphClient } from './getSubgraphClient';
import { ClaimedPrize } from '../types';

/**
 * Pulls from the subgraph all of the claimed prizes for a specific draw
 *
 * @returns {Promise} Promise of an array of ClaimedPrize objects
 */
export const getSubgraphClaimedPrizes = async (
  chainId: number,
  drawId: number,
): Promise<ClaimedPrize[]> => {
  const client = getSubgraphClient(chainId);

  const query = drawPrizeClaimsQuery();
  const variables = { id: drawId.toString() };

  // @ts-ignore: ignore types from GraphQL client lib
  const claimedPrizesResponse: any = await client.request(query, variables).catch((e) => {
    console.error(e.message);
    throw e;
  });

  return claimedPrizesResponse?.draw?.prizeClaims || [];
};

const drawPrizeClaimsQuery = () => {
  return gql`
    query drawPrizeClaimsQuery($id: String!) {
      draw(id: $id) {
        id
        prizeClaims {
          id
          payout
          fee
          timestamp
        }
      }
    }
  `;
};
