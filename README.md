<p align="center">
  <img src="https://raw.githubusercontent.com/GenerationSoftware/pt-v5-utils-js/main/img/pooltogether-logo--purple@2x.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="300">
</p>

<br />

# 🧰 Javascript Utility Library - PoolTogether V5

[📖 Documentation](https://v4.docs.pooltogether.com/protocol/next/introduction)

## Compute

The `@pooltogether/v5-utils-js` [node module package](https://www.npmjs.com/package/@pooltogether/v5-utils-js) provides computations for the PoolTogether v5 protocol.

High-order operations like processing subgraphs and chain state (draws, winners, etc..) is included in the `compute` namespaced functions.

**🖥️ Computations:**

Consume subgraph and protocol chain state to return computed outcomes:

- [computeDrawWinners](docs/md/modules.md#computedrawwinners)

[Create Issue](https://github.com/pooltogether/v5-utils-js/issues) to request new features.<br/>[Open Pull Request](#) adhering to Contribution guidelines.

# 💾 Installation

This project is available as an NPM package:

```sh
npm install @pooltogether/v5-utils-js
```

```sh
yarn add @pooltogether/v5-utils-js
```

The repo can be cloned from Github for contributions.

```sh
git clone https://github.com/pooltogether/v5-utils-js
```

# 📄 Contracts Blob

### `downloadContractsBlob(chainId)`

Gets the list of contracts for a specific network.

Currently supports:

- Ethereum
- Optimism

```ts
import { downloadContractsBlob } from "@pooltogether/v5-utils-js";

async function runAsync() {
  const contracts = await downloadContractsBlob(chainId);
}
runAsync();
```

# 🏆 Draw Results

### `computeDrawWinners(provider, contracts, chainId)`

A helper function that runs five intensive utility functions to compute and return a JSON blob of all previous draw winner's Claim objects for each tier of a prize pool, grouped by vault.

```ts
import { computeDrawWinners } from "@pooltogether/v5-utils-js";

// Compute Winners for the last Draw
const winners = computeDrawWinners(provider, contracts, chainId);

// Returns Claim[] array:
//
// interface Claim {
//   vault: string;
//   winner: string;
//   tier: number;
//   prizeIndex: number;
//   claimed?: boolean;
// }
//
```

# 🏊 Prize Pool Info

### `getPrizePoolInfo(readProvider, contracts)`

Gathers info about the prize pool contained in provided the `contracts` JSON blob.

```ts
import { getPrizePoolInfo, PrizePoolInfo } from "@pooltogether/v5-utils-js";

async function runAsync() {
  const prizePoolInfo: PrizePoolInfo = await getPrizePoolInfo(readProvider, contracts);
}
runAsync();

// Returns PrizePoolInfo object:
//
// interface PrizePoolInfo {
//   drawId: number;
//   numTiers: number;
//   numPrizeIndices: number;
//   reserve: string;
//   tiersRangeArray: number[]; // an easily iterable range of numbers for each tier available (ie. [0, 1, 2])
//   tierPrizeData: {
//     [tierNum: string]: TierPrizeData;
//   };
// }
//
// interface TierPrizeData {
//   prizeIndicesCount: number;
//   prizeIndicesRangeArray: number[]; // an easily iterable range of numbers for each tier's prize indices
//   amount: BigNumber;
//   liquidity: BigNumber;
//   maxPrizesForRemainingLiquidity: number;
// }
//
```

# 🏦 Get Subgraph Vaults

### `getSubgraphVaults(chainId)`

Collects all vaults from the TwabController subgraph into an array

```ts
import { getSubgraphVaults } from "@pooltogether/v5-utils-js";

async function runAsync() {
  let vaults = await getSubgraphVaults(chainId);
}
runAsync();

// Returns Vault[] array:
//
// interface Vault {
//  id: string;
//  accounts: VaultAccount[]; // empty
// }
```

# 👥 Populate Subgraph Vault Accounts

### `populateSubgraphVaultAccounts(chainId, vaults)`

Takes the vaults from `getSubgraphVaults` and adds user deposit account arrays for each of the vaults. `populateSubgraphVaultAccounts` is split up into a separate call from `getSubgraphVaults` as it's very network heavy, needing to page through potentially hundreds of thousands of accounts from the subgraph.

```ts
import { populateSubgraphVaultAccounts } from "@pooltogether/v5-utils-js";

async function runAsync() {
  vaults = await populateSubgraphVaultAccounts(chainId, vaults);
}
runAsync();

// Returns Vault[] array:
//
// interface Vault {
//  ...
//  accounts: VaultAccount[]; // populated!
// }
```

# 🏁 Get Winner's Claims

### `getWinnersClaims(readaProvider, prizePoolInfo, contracts, vaults)`

Collects Claim objects into an array for all prizes in the past draw.

```ts
import { getWinnersClaims } from "@pooltogether/v5-utils-js";

async function runAsync() {
  let claims: Claim[] = await getWinnersClaims(readProvider, prizePoolInfo, contracts, vaults);
}
runAsync();

// Returns Claim[] array:
//
// interface Vault {
//  vault: string;
//  winner: string;
//  tier: number;
//  prizeIndex: number;
//  claimed?: boolean; // null
// }
```

# 🏁 Flag Claimed (RPC)

### `flagClaimedRpc(readProvider, contracts, claims)`

Adds the `claimed` boolean to the claims using RPC lookups.

```ts
import { flagClaimedRpc } from "@pooltogether/v5-utils-js";

async function runAsync() {
  claims = await flagClaimedRpc(readProvider, contracts, claims);
}
runAsync();

// Returns Claim[] array:
//
// interface Vault {
//  ...
//  claimed?: boolean; // now set true or false
// }
```
