import { ethers } from 'ethers';

import { ContractData, ContractsBlob } from '../types.js';

// Returns all the contracts that match the params by name, chain, and contract version
export function getContracts(
  name: string,
  chainId: number,
  providerOrSigner: any,
  contractsBlob: ContractsBlob,
  version = {
    major: 1,
    minor: 0,
    patch: 0,
  },
): ethers.Contract[] {
  if (!name || !chainId) throw new Error(`Invalid Contract Parameters`);

  const contracts = contractsBlob.contracts
    .filter((cont) => cont.type === name && cont.chainId === chainId)
    .filter((contract) => JSON.stringify(contract.version) === JSON.stringify(version));

  let contractsArray: ethers.Contract[] = [];

  for (const contract of contracts) {
    if (contract) {
      contractsArray.push(new ethers.Contract(contract.address, contract.abi, providerOrSigner));
    }
  }

  if (contractsArray.length === 0) {
    throw new Error(
      `Multiple Contracts Unavailable: ${name} on chainId: ${chainId}. Contract version: ${version.major}.${version.minor}.${version.patch}`,
    );
  } else {
    return contractsArray;
  }
}

export const findPrizePoolInContracts = (contracts: ContractsBlob) => {
  const prizePoolContractBlob = contracts.contracts.find(
    (contract) => contract.type === 'PrizePool',
  );
  if (!prizePoolContractBlob) {
    throw new Error('Contracts: No prize pool found in provided contracts blob');
  }

  return prizePoolContractBlob;
};

export const findVaultContractBlobInContracts = (
  contracts: ContractsBlob,
  vaultAddress: string,
) => {
  const vaultContractBlob = contracts.contracts.find(
    (contract: ContractData) =>
      contract.type === 'Vault' && contract.address.toLowerCase() === vaultAddress.toLowerCase(),
  );
  if (!vaultContractBlob) {
    throw new Error(
      `Contracts: No vault found in provided contracts blob with address: ${vaultAddress}`,
    );
  }

  return vaultContractBlob;
};
