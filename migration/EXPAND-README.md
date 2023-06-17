# ⚽ SportsBook 🏗️ UNDER CONSTRUCTION 🚧

## En español

dApp de coordinación de encuentros y apuestas en eventos deportivos entre equipos de deportes no profesionales.

Permite la creacion de desafios deportivos de un equipo a otro, especificando un proveedor de locacion (réferi) quien será el encargado de dar por finalizado el resultado, y en el se deposita la confianza de subir el resultado correcto. Idealmente sería reemplazado por Chainlink o alguna tecnología que evite la necesidad de confiar en un tercero, y así ser trustless como la filosofía blockchain.

Al momento de finalización de cada encuentro, se paga el monto apostado al ganador, y un pequeño fee al proveedor de locacion y al dueño del contrato Sportsbook por el servicio. Tambien se mintea un NFT para cada equipo como conmemoración del resultado del encuentro.

## Para usar

Para usar el cliente, se recomienda usar la version LTS de node 16.13.0 o superior

```
cd client
npm install
npm run dev
```

## Network

#### Tesnet: Mumbai

Por favor, antes de testear el proyecto, fondear su wallet con MATIC MUMBAI.

#### Faucet:

https://mumbaifaucet.com/

https://faucet.polygon.technology/

## Frontend

Primero se llega a una landing que explica brevemente la dapp, permite hacer login con wallet, y luego se ingresa a la app.

La app permite ver dos interfaces que cambian con un switch.

Inicialmente hay dos interfaces, una para equipos y otra para proveedores de locacion

El proveedor de locacion será el encargado de dar por empezado el desafío y de subir los puntajes y darlo por completado.

La interfaz para equipos tiene las siguientes funcionalidades:

- Permite enviar un desafio a otro equipo (wallet address), especificando un proveedor de locacion y un monto a apostar (opcional)
- Permite ver los desafios recibidos con los datos del desafio, y aceptar o rechazar dichos desafios
- Permite ver los matches pasados en un perfil de usuario como NFTs

La interfaz para proveedores de locacion tiene las siguientes funcionalidades.

- Dar por empezado un desafio (con determinado id de desafio)
- Dar por finalizado un desafio (con determinado id de desafio, y determinado puntaje para cada equipo)

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

## Changelog

- 11/12/2022: Added some concept images made with Canva
- 09/12/2022: Added some Wagmi read indicators,improvements to interface and smart contract
- 08/12/2022: Integrated Wagmi hooks to make buttons interact with the blockchain
- 07/12/2022: Made a simple layout for buttons with ChakraUI
- 06/12/2022: Installed NextJS with TypeScript, RainbowKit, Wagmi and ChakraUI for frontend
- 05/12/2022: Tested smart contract with Hardhat and did some corrections. Expanded README.md
- 04/12/2022: Created README.md and first smart contract (SportsbookBase). Tested on scaffold-eth for a quick frontend

## Pending

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
- Give both teams the ability to change location (other team has to accept the change for new location provider to be able to start and complete the challenge))

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
- Explore the option of a platform token ($SPOR)
- Automatically generate a wallet key pair for each user that doesn't register with a wallet, with a section to view the private key like [Gala Games](https://app.gala.games/) or [PunkWallet](https://punkwallet.io/).

# Smart Contracts

1. To run tests, enter `/hardhat` folder with command `cd hardhat`
2. Then, run `yarn` to install dependencies
3. Finally, run `yarn hardhat test` to run the tests

## Smart contract

Deploy: https://mumbai.polygonscan.com/address/0x4f1b7e7f61ad6a6efa788e974bbb9e31519ec05c

### Write Functions

**function createChallenge(address \_team2, address \_locationProvider) public payable**

Desafia a otro address `_team2` especificando un segundo address para el proveedor de locación `_locationProvider`. Asimismo, es payable y tiene un monto mínimo para ser llamada la función, que si se supera, queda todo el monto excedente a ese mínimo como monto apostado.

**function acceptChallenge(uint256 \_challengeId) public payable**

Acepta el desafío indicando el `_challengeId` del desafio a aceptar, y es payable, requiriendo pagar al menos el mismo monto que ha pagado el equipo desafiante al enviar el desafío.

**function updateLocationProvider(uint256 \_challengeId, address \_newLocationProvider) public**

Permite cambiar el address `_newLocationProvider` del desafío especificado `_challengeId`

**function deleteChallenge(uint256 \_challengeId) public**

Permite eliminar o rechazar el desafío, y reembolsar a el/los equipos que hayan pagado para participar.

**function startChallenge(uint256 \_challengeId) public**

Función sólo llamable por el proveedor de locación, permite dar por empezado el desafío, quedando así imposibilitado de serr eliminado/rechazado, y habilitandolo para ser completado al finalizar el encuentro.

**function completeChallenge(uint256 \_challengeId,uint8 \_team1Result,uint8 \_team2Result**

Función que da por concluido el desafío `_challengeId`, específicando el puntaje de cada equipo `_team1Result` y `_team2Result`. Habilita para ser retirado el monto ganado al equipo ganador, así como el monto abonado al proveedor de locación, y mintea un NFT para cada equipo participante con el resultado del partido.

**function claimPrize() external**

Permite reclamar todos los tokens que corresponden al wallet por haber empatado o ganado desafíos.

**function claimLocationProviderWinnings() public**

Permite reclamar todos los tokens que corresponden al wallet por haber arbitrado desafíos.

### Read Functions

**function viewMatchChallenge(uint256 \_id) public view returns (address[3] memory)**
Retorna [team1, team2, locationProvider];

**function viewMatchStatus(uint256 \_id) public view returns (MatchStatus)**
Retorna 0, 1, 2, 3
(pendiente de aceptar, aceptado, iniciado, terminado)

**function viewUnclaimedPrize() public view returns (uint256)**
Muestra el monto de premios sin reclamar por un equipo

**function viewLocationProviderWithdrawableAmount()public view returns (uint256)**
Muestra el monto de premios sin reclamar por un proveedor de locación

**function viewMatchFee() public view returns (uint256)**
Muestra el fee que se compone de lo que se abonará al proveedor de locación y al dueño del contrato Sportsbook.

**function getAllMatches() public view returns (MatchChallenge[])**
Retorna todos los partidos que fueron creados en el contrato.

## Functions

### createChallenge(address \_team2, address \_locationProvider)

_Create a new match challenge_

- Push a MatchChallenge structured item to matchChallenges array.
- Specify an amount to be betted on the outcome of the match
- Specify the location provider

### acceptChallenge(uint256 \_challengeId)

_Accept an existing challenge_

- Push the MatchAccepted structured item to the acceptedChallenges array.
- Add payment for betting on outcome of the match

### deleteChallenge(uint256 \_challengeId)

_Function that deletes existing challenge_

- Set challenge on matchChallenges as finished
- Return ETH paid

### updateChallengedTeam(uint256 \_challengeId, address \_newTeam2)

_Update an existing challenge's team 2_

- Give team1 (proposer) the ability to challenge a different team on the same proposal.

### updateLocationProvider(uint256 \_challengeId, address \_newLocationProvider)

_Update an existing challenge's location provider_

- Give both teams the ability to update the location provider.
- If a location update is submitted, it must be accepted by the other team

### functions to view existing challenges... (to be listed)

### struct MatchChallenge

_Data structure for a match_

- **Team(s)** involved in a match.
- **Location provider**
- If match already been **accepted** by both teams
- If match already **started** according to location provider
- If match already **finished** according to location provider
  (after setting **finished** to true, trigger payments for location provider and winner),

## Frontend

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

## Cosas que nos faltaron:

- La interface del Referee, que se encarga de actualizar los estados del partido desde su inicio hasta su finalización.
- El contrato funciona en su totalidad, pero no se llegó a integrar algunas de las funciones relacionadas a los NFT en el Front.
- La UI está completa pero no interactúa en su totalidad con el contrato.
- No está implementado el matchmaking.
- No está implementado los perfiles de los usuarios. (Social)
- No está implementado la busqueda por ID de partidos.
- No está implementado el rematch.
