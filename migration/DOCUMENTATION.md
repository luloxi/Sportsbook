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
