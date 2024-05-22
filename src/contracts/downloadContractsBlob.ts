import nodeFetch from 'node-fetch';

import { ContractsBlob } from '../types.js';

/**
 * Downloads the latest contracts blob from the raw data source URL provided
 *
 * @param {contractJsonUrl} string
 *
 * @returns {ContractsBlob} contracts
 */
export const downloadContractsBlob = async (
  contractJsonUrl: string,
  fetch?: any,
): Promise<ContractsBlob> => {
  let contracts;

  if (!fetch) {
    fetch = nodeFetch;
  }

  try {
    const response = await fetch(contractJsonUrl);
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
