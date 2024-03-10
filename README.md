# ⚽ Sportsbook 🏗️

**Betting dapp using ChakraUI**

## How can I contribute to this build?

- 🐣 Project being developed by [Newbie's Lounge](https://lulox.notion.site/Newbie-s-Lounge-68ea7c4c5f1a4ec29786be6a76516878)
- 👷‍♀️ To view current development tasks, [check the Issues on the Github repo](https://github.com/luloxi/Sportsbook/issues).
- 🧰 To chat with other buidlers about this project, [join Newbies Lounge Telegram group](https://t.me/+FwCZPG51UhwzOTZh)
- 🛠️ To submit a PR (Pull Request), [fork and pull](https://github.com/susam/gitpr) a request to this repo.
- 🐣 Make sure you know the ETH Tech Stack and understand [how to make a dApp using Scaffold-ETH 2](https://lulox.notion.site/Newbie-s-Lounge-68ea7c4c5f1a4ec29786be6a76516878).

## Dapp flow is:

1. An address challenges another address and specifies a referee address and optionally a bet amount
2. Challenged address accepts the challenge and bets the same amount as the proposer address
3. Referee sets the game as started and challenge can't be canceled no more (suposedly, this coincides with a real life sports match)
4. Referee sets the score and prize gets distributed accordingly (and then all to winner, or split if tie)
5. (still not implemented) After results are in, a SVG NFT with the results of the match in the image can be claimed by all parts involved

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Sportsbook, follow the steps below:

1. Open a terminal, clone this repo, and install dependencies

```
git clone https://github.com/luloxi/sportsbook.git
cd sportsbook
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the Home or debug contracts in the frontend.

## Relevant files

- Smart contract `Sportsbook.sol` in `packages/hardhat/contracts`
- Deployment scripts in `packages/hardhat/deploy`
- Frontend files in `packages/nextjs/pages`
- Types files in `packages/nextjs/types`

## Completed product aims to

- Offer multiple ways of betting
- Have a social network that allows you to find and challenge other teams on the same geographic zone
- Generate an income for verified referees that help keep the platform fair

### Why is it useful

**For everyone:**

- Showcase past matches on your profile as NFTs
- Showcase stats and other information on profiles
- Allow communication and coordination between users, teams and referees with the social part

**For users:**

- Social media app to find a team for the sport you select
- Find a team on your geographic zone

**For teams:**

- Find and challenge other teams on the same geographic zone
- Pay to location providers for matches against other teams (half each team)
- Bet between teams on the outcome of a given match

**For referees:**

- Act a trusted third party in exchange for payment
- Get instant payment after setting the score of a match

## Development notes

You can check current development notes [here](https://lulox.notion.site/Sportsbook-4d353bea4260471f9fc60c1b8051be9b?pvs=4)
