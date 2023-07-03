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

## Pending changes

### Now

**Smart contracts**

> Challenge: Make the challenge be for a new sport (chess, tennis, golf, etc)

- Specify an amount to be paid to the referee
- Give both teams the ability to update the challenge with a bet?
- Include Date and time of the match ([to be included later](https://soliditytips.com/articles/solidity-dates-time-operations/)) wherever necessary
- Mint a basic NFT when completing the challenge by referee
- Make the NFT include dynamically the result of the challenge and location provider & teams logos.
- Explore the option of a [feeless payment gateway](https://github.com/lacrypta/gateway)
- Explore the option of a platform token ($SPBK)
- Explore the option of referees to be a contract that contains data on how much it wants to be paid, and days and time available for matches

**Frontend**

- Show existing challenges for connected wallet
- Include a search engine for teams when challenging and updating
- Integrate mail, Google, Twitter and Facebook login options
- Start integrating a social media feature

**Profiles**

- A display for NFTs
- Show user stats (Challenges made, received, and played, etc)
- Contact information
- Preferred locations & geographic area for matchmaking.

### struct MatchChallenge

_Data structure for a match_

- **Team(s)** involved in a match.
- **Referee**
- **Bet amount** (if any)
- If match already been **accepted** by both teams
- If match already **started** according to location provider
- If match already **finished** according to location provider
  (after setting **finished** to true, trigger payments for location provider and winner),
