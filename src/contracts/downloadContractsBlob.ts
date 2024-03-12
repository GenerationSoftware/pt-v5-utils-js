import nodeFetch from 'node-fetch';

import { ContractsBlob } from '../types.js';
import { CONTRACTS_STORE } from '../utils/constants.js';

/**
 * Downloads the latest contracts blob from the raw data source on GitHub
 * @param {number} chainId
 * @returns {ContractsBlob} contracts
 */
export const downloadContractsBlob = async (
  chainId: number,
  fetch?: any,
): Promise<ContractsBlob> => {
  let contracts;

  if (!fetch) {
    fetch = nodeFetch;
  }

  try {
    const response = await fetch(CONTRACTS_STORE[chainId.toString()]);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const body = await response.json();
    contracts = body;
  } catch (err) {
    console.log(err);
  }

  return contracts;
};
