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
const MyContractABI = require('./abis/MyContract.json');
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
const { abi, address, receipt } = MyContract
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
$ yarn deploy rinkeby
```

It will update the `deployments/` dir.

## TODO

[ ] Item1
[ ] Item2


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Licence

[MIT](https://choosealicense.com/licenses/mit/)