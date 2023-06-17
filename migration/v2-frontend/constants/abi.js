export const ABI = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_locationProviderFee',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_contractOwnerFee',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'MatchChallengeId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'team1',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'team2',
                type: 'address',
            },
        ],
        name: 'ChallengeAccepted',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'MatchChallengeId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'team1Result',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'team2Result',
                type: 'uint8',
            },
        ],
        name: 'ChallengeResult',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'MatchChallengeId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'team1',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'team2',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'NewChallenge',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_challengeId',
                type: 'uint256',
            },
        ],
        name: 'acceptChallenge',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimLocationProviderWinnings',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimPrize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_challengeId',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: '_team1Result',
                type: 'uint8',
            },
            {
                internalType: 'uint8',
                name: '_team2Result',
                type: 'uint8',
            },
        ],
        name: 'completeChallenge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'contractOwnerFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'contractWithdrawableAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_team2',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_locationProvider',
                type: 'address',
            },
        ],
        name: 'createChallenge',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_challengeId',
                type: 'uint256',
            },
        ],
        name: 'deleteChallenge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAllMatches',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'matchId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'team1',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'team2',
                        type: 'address',
                    },
                    {
                        internalType: 'enum MatchStatus',
                        name: 'matchStatus',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'locationProvider',
                        type: 'address',
                    },
                ],
                internalType: 'struct MatchChallenge[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'locationProviderFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'loseNft',
        outputs: [
            {
                internalType: 'contract LoseNft',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'matchChallenges',
        outputs: [
            {
                internalType: 'uint256',
                name: 'matchId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'team1',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'team2',
                type: 'address',
            },
            {
                internalType: 'enum MatchStatus',
                name: 'matchStatus',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'locationProvider',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_newAmount',
                type: 'uint256',
            },
        ],
        name: 'setContractOwnerFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_newAmount',
                type: 'uint256',
            },
        ],
        name: 'setLocationProviderFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_challengeId',
                type: 'uint256',
            },
        ],
        name: 'startChallenge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'tieNft',
        outputs: [
            {
                internalType: 'contract TieNft',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalMatchesPlayed',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'unclaimedLocationProviderAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'unclaimedTeamPrize',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_challengeId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_newLocationProvider',
                type: 'address',
            },
        ],
        name: 'updateLocationProvider',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'viewLocationProviderWithdrawableAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_id',
                type: 'uint256',
            },
        ],
        name: 'viewMatchChallenge',
        outputs: [
            {
                internalType: 'address[3]',
                name: '',
                type: 'address[3]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'viewMatchFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_id',
                type: 'uint256',
            },
        ],
        name: 'viewMatchStatus',
        outputs: [
            {
                internalType: 'enum MatchStatus',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'viewUnclaimedPrize',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'winNft',
        outputs: [
            {
                internalType: 'contract WinNft',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
