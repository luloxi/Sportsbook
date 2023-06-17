# ⚽ SportsBook 🏗️ UNDER CONSTRUCTION 🚧

dApp for when you want to bet when to bet between friendly teams and pay for the location of a match easily

The location provider is also the referee that logs the result of the match, and distributes the betted amount accordingly

> ⚽ Challenge: make the result come from a coinflip that uses Chainlink VRF and distributes rewards with Chainlink Keepers

> ⚽ Challenge: make location provider and referee be different addresses and get different fees

"hackathon" version mints an NFT for each team with the win/tie/lose result

> ⚽ Challenge: make it be just one contract

> ⚽ Challenge: make the NFTs have the results and match info in metadata

> ⚽ Challenge: make the NFTs image have the logos and names of both teams

## Sports dApp

**For everyone:**

- Allow communication between users, teams and location providers
- Showcase past matches on your profile as NFTs
- Showcase stats and other information on profiles

**For users:**

- Social media app to find a team for the sport you select
- Find a team on your geographic zone

**For teams:**

- Find and challenge other teams on the same geographic zone
- Pay to location providers for matches against other teams (half each team)
- Bet between teams on the outcome of a given match

**For location providers:**

- Get instant payment after match is over (and setting it's score)

(for big sports betting there's already [other options](https://stake.com/) )

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v18 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

🚨 If you are using a version < v18 you will need to remove `openssl-legacy-provider` from the `start` script in `package.json`

> 1️⃣ clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/luloxi/sportsbook-dapp.git
```

> 2️⃣ install and start your 👷‍ Hardhat chain:

```bash
cd sportsbook-dapp
yarn install
yarn chain
```

> 3️⃣ in a second terminal window, start your 📱 frontend:

```bash
cd sportsbook-dapp
yarn start
```

> 4️⃣ in a third terminal window, 🛰 deploy your contract:

```bash
cd sportsbook-dapp
yarn deploy
```

- Need more info? Read how to about [scaffold-eth environment here](./ENVIRONMENT.md)
- Don't understand the contract? Read [info about its functions](./FUNCTIONS.md)

> Challenge: Make the challenge be for a new sport (chess, tennis, golf, etc)

## Pending changes (original Sportsbook.sol)

> ⚽ Challenge: pick one and implement it

### Now

**Frontend**

- Add a switch to change between team and location provider interface
- Add a list of all existing challenges
- Read current challenge cost from blockchain when accepting

**Smart contracts**

- Allow for createChallenge to not include a challenged address, thus making the challenge acceptable by anyone
- If team2 is not specified in a challenge, make whoever calls acceptChallenge the team2 address
- Specify an amount to be paid to the location provider
- Add updateLocationProvider() function

### Later

**Frontend**

- Add an option to bet when accepting?
- Show location provider address and bet amount (if any) and calculate a total when accepting/declining
- Add a button to select different layouts (for location provider and team options)
- Add a functionality to detect current chain Id and select correct contract address accordingly

**Smart contract**

- Give both teams the ability to update the challenge with a bet?
- Include Date and time of the match ([to be included later](https://soliditytips.com/articles/solidity-dates-time-operations/)) wherever necessary
- Mint a basic NFT when completing the challenge by location provider
- Give both teams the ability to change location (other team has to accept the change for new location provider to be able to start and complete the challenge)

### Future

**Frontend**

- Translate address to a name (user/team/location provider)
- Add another layout for user options
- Show user stats and other information
- Show existing challenges for connected wallet
- Include a search engine for teams when challenging and updating
- Integrate mail, Google, Twitter and Facebook login options
- Start integrating a social media feature

**Smart contract**

- Add a small fee when processing payments
- Make the NFT include dynamically the result of the challenge and location provider & teams logos.
- Explore the option of a [feeless payment gateway](https://github.com/lacrypta/gateway)
- Explore the option of location providers to be a contract that contains data on how much it wants to be paid, and days and time available for matches
- Explore the option of a platform token ($SPBK)

### struct MatchChallenge

_Data structure for a match_

- **Team(s)** involved in a match.
- **Location provider**
- If match already been **accepted** by both teams
- If match already **started** according to location provider
- If match already **finished** according to location provider
  (after setting **finished** to true, trigger payments for location provider and winner),

## Frontend (original)

> ⚽ Challenge: migrate it from `migrations/original/nextjs-frontend` to scaffold-eth

### Functionalities to add:

**Displaying existing challenges for connected wallet:**

- **address and name** of who made the challenge
- **challenge cost**
- **bet amount** (if any)
- **accept** button
- **cancel** button

**Displaying unstarted challenges by location provider**

- a button to **start**
- a button to **complete**
- a button to **decline**

**Profiles**

- A display for NFTs
- Challenges made, received, and played
- Contact information
- Preferred locations & geographic area for matchmaking.

> ⚽ Challenge: Implement the frontend similar to concept in `migrations/original/concept`, can take inspiration from `migrations/hackathon/client` with deploy instructions in `migrations/hackathon/README.md`

## Changelog

- 25/24/2023: Migrated original contract to scafold-eth, and added a migrations folder with files from original and hackathon versions
- 12/04/2023: Added hackathon repo to this one. Team didn't care to keep developing it further.
- 16/12/2022: Lulox's team submitted [this repo](https://github.com/alejoviola/hackaton-2022-Gol) and won the 1st place!
- 15/12/2022: Entered Think&Dev hackathon as the version in the original branch
- 11/12/2022: Added some concept images made with Canva
- 09/12/2022: Added some Wagmi read indicators,improvements to interface and smart contract
- 08/12/2022: Integrated Wagmi hooks to make buttons interact with the blockchain
- 07/12/2022: Made a simple layout for buttons with ChakraUI
- 06/12/2022: Installed NextJS with TypeScript, RainbowKit, Wagmi and ChakraUI for frontend
- 05/12/2022: Tested smart contract with Hardhat and did some corrections. Expanded README.md
- 04/12/2022: Created README.md and first smart contract (SportsbookBase). Tested on scaffold-eth for a quick frontend
