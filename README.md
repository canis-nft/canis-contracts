# Canis contracts

[![built-with openzeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-3677FF)](https://docs.openzeppelin.com/)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/protofire/solhint/master/LICENSE)

## Installation

To run the protocol, pull the repository from GitHub and install its dependencies. You will need yarn or npm installed.

```sh
git clone https://github.com/canis-nft/canis-contracts
cd canis-contracts
```

## Setup

### Install dependencies

```sh
yarn
```

### Development

### Compile

```sh
yarn compile
```

The Application Binary Interfaces (ABI) for all protocol's contracts and related contract are available in the `abis/` directory

For instance, to pull in the MyContract ABI:

```javascript
const MyContractABI = require('./abis/MyContract.json')
```

### Testing

We use [Hardhat](https://hardhat.dev) and [hardhat-deploy](https://github.com/wighawag/hardhat-deploy)

To run unit & integration tests:

```sh
$ yarn test
```

To run coverage:

```sh
$ yarn coverage
```

To run fuzz tests:

```sh
$ yarn echidna
```

### Linter

We use [solhint](https://github.com/protofire/solhint)

To lint the code, run:

```sh
$ yarn hint
```

## Deployment

Start a local node and deploy the top-level contracts:

```bash
yarn start
yarn deploy localhost
```

The artifacts are available in the `deployments/` directory. For example, to pull in the Canis artifact:

```javascript
const MyContract = require('./deployments/rinkeby/MyContract.json')
const {abi, address, receipt} = MyContract
```
### Connect Locally

Start up a [Hardhat Console](https://hardhat.dev/guides/hardhat-console.html):

```bash
yarn console --network localhost
```

### Deploy to Live Networks

Copy over .envrc.example to .envrc

```
$ cp .envrc.example .envrc
```

Make sure to update the enviroment variables with suitable values.

Now enable the env vars using [direnv](https://direnv.net/docs/installation.html)

```
$ direnv allow
```

Now deploy to a network like so:

```
yarn deploy rinkeby
yarn deploy mainnet
yarn deploy fuji
yarn deploy avalanche
```

It will update the `deployments/` dir.

### Uploading images and metadata to ipfs

- Pack your images:

```bash
yarn ipfs:images
```

- Pack your metadata:

```bash
yarn ipfs:metadata
```

## OpenSea Royalty integration

For instance, check [here](https://ipfs.io/ipfs/QmbBXi3zGaFZ4S2cAea56cGhpD6eSRNL9b6BCUnrTpukT6)

```json
{
  "name": "CanisNFT",
  "description": "The collection is regarding canis collection",
  "image": "ipfs://QmdBahHzFZLHR25hC4M2A8UifaApJReA49Hcg5dnfvG6MT",
  "external_url": "http://www.canisnft.com",
  "seller_fee_basis_points": 100, 
  "fee_recipient": "0x8E0496C9786f8271Bc3712c9e5F794A137c2Dc87",
  }
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Licence

[MIT](https://choosealicense.com/licenses/mit/)
