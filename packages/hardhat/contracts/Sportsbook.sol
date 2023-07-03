// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title A sports betting contract
 * @author Lulox
 * @notice This contract is for creating a bet between two parts with a referee that decides who wins the betted amount
 */
contract Sportsbook {
    enum MatchState {
        PENDING,
        ACCEPTED,
        STARTED,
        FINISHED,
        CANCELED
    }

    enum UpdateRefereeState {
        INACTIVE,
        PENDING
    }

    struct MatchChallenge {
        address team1;
        address team2;
        MatchState state;
        uint256 bet;
        address referee;
    }

    struct UpdateReferee {
        address proposingTeam;
        address newReferee;
        UpdateRefereeState state;
    }

    MatchChallenge[] public matchChallenges;
    mapping(uint256 => UpdateReferee) public updateRefereeRequests;

    event ChallengeCreated(
        uint256 indexed challengeId, address indexed team1, address indexed team2, address referee, uint256 bet
    );
    event ChallengeAccepted(uint256 indexed challengeId, address indexed team1, address indexed team2);
    event ChallengeStarted(uint256 indexed challengeId, address indexed referee, address team1, address team2);
    event ChallengeResult(
        uint256 indexed challengeId, address indexed team1, address indexed team2, uint8 team1Result, uint8 team2Result
    );
    event ChallengeCanceled(uint256 indexed challengeId, address indexed canceledBy);
    event UpdateRefereeRequest(uint256 indexed challengeId, address indexed proposingTeam, address indexed newReferee);
    event UpdateRefereeAccepted(uint256 indexed challengeId, address indexed newReferee);

    constructor() {}

    function createChallenge(address _team2, address referee) public payable {
        matchChallenges.push(MatchChallenge(msg.sender, _team2, MatchState.PENDING, msg.value, referee));
        emit ChallengeCreated(matchChallenges.length - 1, msg.sender, _team2, referee, msg.value);
    }

    function acceptChallenge(uint256 _challengeId) public payable {
        require(msg.sender == matchChallenges[_challengeId].team2, "You're not the challenged team!");
        require(msg.value >= matchChallenges[_challengeId].bet, "Haven't sent enough ETH!");
        require(matchChallenges[_challengeId].state == MatchState.PENDING, "Challenge has already been accepted!");

        matchChallenges[_challengeId].state = MatchState.ACCEPTED;
        emit ChallengeAccepted(_challengeId, matchChallenges[_challengeId].team1, matchChallenges[_challengeId].team2);
    }

    function startChallenge(uint256 _challengeId) public {
        // Check
        require(matchChallenges[_challengeId].state == MatchState.ACCEPTED, "Team2 hasn't accepted the challenge!");
        require(matchChallenges[_challengeId].referee == msg.sender, "You're not the referee!");
        require(matchChallenges[_challengeId].team2 != address(0), "Lacking a team or match canceled");

        // Effect
        matchChallenges[_challengeId].state = MatchState.STARTED;
        emit ChallengeStarted(
            _challengeId, msg.sender, matchChallenges[_challengeId].team1, matchChallenges[_challengeId].team2
        );
    }

    function completeChallenge(uint256 _challengeId, uint8 _team1Result, uint8 _team2Result) public {
        // Check
        require(matchChallenges[_challengeId].state == MatchState.STARTED, "Challenge hasn't started!");
        require(matchChallenges[_challengeId].team2 != address(0), "There must be a team2!");
        require(msg.sender == matchChallenges[_challengeId].referee, "You must be the referee to say who won");
        // Effect
        matchChallenges[_challengeId].state = MatchState.FINISHED;
        emit ChallengeResult(
            _challengeId,
            matchChallenges[_challengeId].team1,
            matchChallenges[_challengeId].team1,
            _team1Result,
            _team2Result
        );
        // Interact
        if (_team1Result > _team2Result) {
            (bool success,) =
                payable(matchChallenges[_challengeId].team1).call{value: matchChallenges[_challengeId].bet * 2}("");
            require(success, "Sportsbook: Transfer to team1 failed.");
        }
        if (_team1Result < _team2Result) {
            (bool success,) =
                payable(matchChallenges[_challengeId].team2).call{value: matchChallenges[_challengeId].bet * 2}("");
            require(success, "Sportsbook: Transfer to team2 failed.");
        }
        if (_team1Result == _team2Result) {
            (bool success,) =
                payable(matchChallenges[_challengeId].team1).call{value: matchChallenges[_challengeId].bet}("");
            (bool success2,) =
                payable(matchChallenges[_challengeId].team2).call{value: matchChallenges[_challengeId].bet}("");
            require(success, "Sportsbook: Transfer to team1 failed.");
            require(success2, "Sportsbook: Transfer to team2 failed.");
        }
    }

    function updateReferee(uint256 _challengeId, address _newReferee) public {
        require(
            msg.sender == matchChallenges[_challengeId].team1 || msg.sender == matchChallenges[_challengeId].team2,
            "You're not any of the teams!"
        );
        require(
            matchChallenges[_challengeId].state == MatchState.PENDING
                || matchChallenges[_challengeId].state == MatchState.ACCEPTED,
            "Challenge has already been started!"
        );
        require(updateRefereeRequests[_challengeId].state == UpdateRefereeState.INACTIVE, "There's already a request!");

        updateRefereeRequests[_challengeId] = UpdateReferee(msg.sender, _newReferee, UpdateRefereeState.PENDING);
    }

    function answerUpdateReferee(uint256 _challengeId, bool _choice) public {
        require(
            (msg.sender == matchChallenges[_challengeId].team1 || msg.sender == matchChallenges[_challengeId].team2),
            "You're not any of the teams!"
        );
        require(msg.sender != updateRefereeRequests[_challengeId].proposingTeam, "You're the proposing team!");
        require(updateRefereeRequests[_challengeId].state == UpdateRefereeState.PENDING, "There's no request!");

        updateRefereeRequests[_challengeId].state = UpdateRefereeState.INACTIVE;
        if (_choice == true) {
            matchChallenges[_challengeId].referee = updateRefereeRequests[_challengeId].newReferee;
        }
    }

    function deleteChallenge(uint256 _challengeId) public {
        // Check
        require(matchChallenges[_challengeId].state < MatchState.STARTED, "Challenge has already been started!");
        require(
            msg.sender == matchChallenges[_challengeId].team1 || msg.sender == matchChallenges[_challengeId].team2
                || msg.sender == matchChallenges[_challengeId].referee,
            "You're not any of the teams nor the referee!"
        );

        // Interact (reentrancy vulnerable, apply reentrancy guard)
        (bool success,) =
            payable(matchChallenges[_challengeId].team1).call{value: matchChallenges[_challengeId].bet}("");
        require(success, "Sportsbook: Transfer to team1 failed.");
        if (matchChallenges[_challengeId].state == MatchState.ACCEPTED) {
            (bool success2,) =
                payable(matchChallenges[_challengeId].team2).call{value: matchChallenges[_challengeId].bet}("");
            require(success2, "Sportsbook: Transfer to team2 failed.");
        }
        // Effect
        matchChallenges[_challengeId].state = MatchState.CANCELED;
        emit ChallengeCanceled(_challengeId, msg.sender);
    }

    function viewMatchChallenge(uint256 _id)
        public
        view
        returns (address team1, address team2, MatchState state, uint256 bet, address referee)
    {
        team1 = matchChallenges[_id].team1;
        team2 = matchChallenges[_id].team2;
        state = matchChallenges[_id].state;
        bet = matchChallenges[_id].bet;
        referee = matchChallenges[_id].referee;
    }

    function viewMatchCount() public view returns (uint256) {
        return matchChallenges.length;
    }

    function viewMatchState(uint256 _id) public view returns (MatchState) {
        return matchChallenges[_id].state;
    }

    function viewMatchBet(uint256 _id) public view returns (uint256) {
        return matchChallenges[_id].bet;
    }

    function viewMatchReferee(uint256 _id) public view returns (address) {
        return matchChallenges[_id].referee;
    }

    function viewUpdateRefereeRequest(uint256 _challengeId)
        public
        view
        returns (address proposingTeam, address newReferee, UpdateRefereeState state)
    {
        proposingTeam = updateRefereeRequests[_challengeId].proposingTeam;
        newReferee = updateRefereeRequests[_challengeId].newReferee;
        state = updateRefereeRequests[_challengeId].state;
    }

    function viewRequestedReferee(uint256 _id) public view returns (address) {
        return updateRefereeRequests[_id].newReferee;
    }

    function viewUpdateRefereeState(uint256 _id) public view returns (UpdateRefereeState) {
        return updateRefereeRequests[_id].state;
    }

    function viewUpdateRefereeProposingTeam(uint256 _id) public view returns (address) {
        return updateRefereeRequests[_id].proposingTeam;
    }
}
