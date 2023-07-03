# ⚽ SportsBook 🏗️ UNDER CONSTRUCTION 🚧

## En español

dApp de coordinación de encuentros y apuestas en eventos deportivos entre equipos de deportes no profesionales.

Permite la creacion de desafios deportivos de un equipo a otro, especificando un proveedor de locacion (réferi) quien será el encargado de dar por finalizado el resultado, y en el se deposita la confianza de subir el resultado correcto. Idealmente sería reemplazado por Chainlink o alguna tecnología que evite la necesidad de confiar en un tercero, y así ser trustless como la filosofía blockchain.

Al momento de finalización de cada encuentro, se paga el monto apostado al ganador, y un pequeño fee al proveedor de locacion y al dueño del contrato Sportsbook por el servicio. Tambien se mintea un NFT para cada equipo como conmemoración del resultado del encuentro.

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

## Cosas que nos faltaron:

- La interface del Referee, que se encarga de actualizar los estados del partido desde su inicio hasta su finalización.
- El contrato funciona en su totalidad, pero no se llegó a integrar algunas de las funciones relacionadas a los NFT en el Front.
- La UI está completa pero no interactúa en su totalidad con el contrato.
- No está implementado el matchmaking.
- No está implementado los perfiles de los usuarios. (Social)
- No está implementado la busqueda por ID de partidos.
- No está implementado el rematch.
