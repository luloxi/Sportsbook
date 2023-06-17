const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        Sportsbook: {
          address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          abi: [
            {
              inputs: [],
              stateMutability: "payable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "uint256",
                  name: "MatchChallengeId",
                  type: "uint256",
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
                  name: "locationProvider",
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
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "isMatchAccepted",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
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
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "isMatchFinished",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
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
                  name: "_id",
                  type: "uint256",
                },
              ],
              name: "isMatchStarted",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
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
                  internalType: "bool",
                  name: "accepted",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "started",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "finished",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "locationProvider",
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
                  name: "_newTeam2",
                  type: "address",
                },
              ],
              name: "updateChallengedTeam",
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
                  name: "_newLocationProvider",
                  type: "address",
                },
              ],
              name: "updateLocationProvider",
              outputs: [],
              stateMutability: "nonpayable",
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
                  internalType: "address[3]",
                  name: "",
                  type: "address[3]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
