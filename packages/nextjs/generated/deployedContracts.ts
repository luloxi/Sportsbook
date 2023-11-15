const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        Sportsbook: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
              ],
              name: "ChallengeAccepted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "canceledBy",
                  type: "address",
                },
              ],
              name: "ChallengeCanceled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "referee",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
              ],
              name: "ChallengeCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint8",
                  name: "team1Result",
                  type: "uint8",
                },
                {
                  indexed: false,
                  internalType: "uint8",
                  name: "team2Result",
                  type: "uint8",
                },
              ],
              name: "ChallengeResult",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "referee",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
              ],
              name: "ChallengeStarted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "PrizeWithdrawn",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "proposingTeam",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newReferee",
                  type: "address",
                },
              ],
              name: "UpdateRefereeRequest",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "challengeId",
                  type: "uint256",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newReferee",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "updateAccepted",
                  type: "bool",
                },
              ],
              name: "UpdateRefereeResponse",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
              ],
              name: "acceptChallenge",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "_choice",
                  type: "bool",
                },
              ],
              name: "answerUpdateReferee",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
                {
                  internalType: "uint8",
                  name: "_team1Result",
                  type: "uint8",
                },
                {
                  internalType: "uint8",
                  name: "_team2Result",
                  type: "uint8",
                },
              ],
              name: "completeChallenge",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_team2",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "referee",
                  type: "address",
                },
              ],
              name: "createChallenge",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
              ],
              name: "deleteChallenge",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "matchChallenges",
              outputs: [
                {
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
                {
                  internalType: "enum Sportsbook.MatchState",
                  name: "state",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "referee",
                  type: "address",
                },
                {
                  internalType: "uint8",
                  name: "team1Result",
                  type: "uint8",
                },
                {
                  internalType: "uint8",
                  name: "team2Result",
                  type: "uint8",
                },
                {
                  internalType: "bool",
                  name: "team1Withdrawn",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "team2Withdrawn",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
              ],
              name: "startChallenge",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "_newReferee",
                  type: "address",
                },
              ],
              name: "updateReferee",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "updateRefereeRequests",
              outputs: [
                {
                  internalType: "address",
                  name: "proposingTeam",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "newReferee",
                  type: "address",
                },
                {
                  internalType: "enum Sportsbook.UpdateRefereeState",
                  name: "state",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewMatchBet",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewMatchChallenge",
              outputs: [
                {
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
                {
                  internalType: "enum Sportsbook.MatchState",
                  name: "state",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "referee",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "viewMatchCount",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewMatchReferee",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewMatchState",
              outputs: [
                {
                  internalType: "enum Sportsbook.MatchState",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewRequestedReferee",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewUpdateRefereeProposingTeam",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "viewUpdateRefereeState",
              outputs: [
                {
                  internalType: "enum Sportsbook.UpdateRefereeState",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_challengeId",
                  type: "uint256",
                },
              ],
              name: "withdrawPrize",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        TicTacToe: {
          address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "gameId",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team1",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "team2",
                  type: "address",
                },
              ],
              name: "GameAccepted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "gameId",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "player1",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "player2",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
              ],
              name: "GameCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "gameId",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "winner",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "enum TicTacToe.GameState",
                  name: "state",
                  type: "uint8",
                },
              ],
              name: "GameFinished",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "bytes32",
                  name: "gameId",
                  type: "bytes32",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint8",
                  name: "position",
                  type: "uint8",
                },
              ],
              name: "MoveMade",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_player2",
                  type: "address",
                },
              ],
              name: "createGame",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "gameId",
                  type: "bytes32",
                },
              ],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "gameIdCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              name: "games",
              outputs: [
                {
                  internalType: "address",
                  name: "player1",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "player2",
                  type: "address",
                },
                {
                  internalType: "enum TicTacToe.GameState",
                  name: "state",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "lastMoveTime",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "player1Withdrawn",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "player2Withdrawn",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "_gameId",
                  type: "bytes32",
                },
              ],
              name: "getBoard",
              outputs: [
                {
                  internalType: "uint8[9]",
                  name: "",
                  type: "uint8[9]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "_gameId",
                  type: "bytes32",
                },
                {
                  internalType: "uint8",
                  name: "position",
                  type: "uint8",
                },
              ],
              name: "makeMove",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
