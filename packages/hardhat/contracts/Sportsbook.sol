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
    struct MatchChallenge {
        address team1;
        address team2;
        bool accepted;
        bool started;
        bool finished;
        uint256 amount;
        address referee;
    }

    MatchChallenge[] public matchChallenges;

    event ChallengeResult(uint256 indexed MatchChallengeId, uint8 team1Result, uint8 team2Result);

    constructor() payable {}

    function createChallenge(address _team2, address referee) public payable {
        matchChallenges.push(MatchChallenge(msg.sender, _team2, false, false, false, msg.value, referee));
    }

    function acceptChallenge(uint256 _challengeId) public payable {
        require(msg.sender == matchChallenges[_challengeId].team2, "You're not the challenged team!");
        require(msg.value >= matchChallenges[_challengeId].amount, "Haven't sent enough ETH!");
        matchChallenges[_challengeId].accepted = true;
    }

    function startChallenge(uint256 _challengeId) public {
        // Check
        require(matchChallenges[_challengeId].accepted == true, "Team2 hasn't accepted the challenge!");
        require(matchChallenges[_challengeId].referee == msg.sender, "You're not the location provider!");
        require(matchChallenges[_challengeId].team2 != address(0), "Lacking a team or match canceled");

        // Effect
        matchChallenges[_challengeId].started = true;
    }

    function completeChallenge(uint256 _challengeId, uint8 _team1Result, uint8 _team2Result) public {
        // Check
        require(matchChallenges[_challengeId].started == true, "Challenge hasn't started!");
        require(matchChallenges[_challengeId].finished == false, "Challenge already completed");
        require(matchChallenges[_challengeId].team2 != address(0), "There must be a team2!");
        require(msg.sender == matchChallenges[_challengeId].referee, "You must be the location provider to say who won");
        // Effect
        matchChallenges[_challengeId].finished = true;
        emit ChallengeResult(_challengeId, _team1Result, _team2Result);
        // Interact
        if (_team1Result > _team2Result) {
            (bool success,) =
                payable(matchChallenges[_challengeId].team1).call{value: matchChallenges[_challengeId].amount * 2}("");
            require(success, "Sportsbook: Transfer to team1 failed.");
        }
        if (_team1Result < _team2Result) {
            (bool success,) =
                payable(matchChallenges[_challengeId].team2).call{value: matchChallenges[_challengeId].amount * 2}("");
            require(success, "Sportsbook: Transfer to team2 failed.");
        }
        if (_team1Result == _team2Result) {
            (bool success,) =
                payable(matchChallenges[_challengeId].team1).call{value: matchChallenges[_challengeId].amount}("");
            (bool success2,) =
                payable(matchChallenges[_challengeId].team2).call{value: matchChallenges[_challengeId].amount}("");
            require(success, "Sportsbook: Transfer to team1 failed.");
            require(success2, "Sportsbook: Transfer to team2 failed.");
        }
    }

    function updateChallengedTeam(uint256 _challengeId, address _newTeam2) public {
        require(msg.sender == matchChallenges[_challengeId].team1, "You're not the team1!");
        require(matchChallenges[_challengeId].accepted != true, "Challenge has already been accepted!");

        matchChallenges[_challengeId].team2 = _newTeam2;
    }

    function updateReferee(uint256 _challengeId, address _newReferee) public {
        require(
            msg.sender == matchChallenges[_challengeId].team1 || msg.sender == matchChallenges[_challengeId].team2,
            "You're not any of the teams!"
        );
        require(matchChallenges[_challengeId].started != true, "Challenge has already been started!");

        matchChallenges[_challengeId].referee = _newReferee;
    }

    // function acceptUpdatereferee(uint256 _challengeId) public {
    //     require(msg.sender == matchChallenges[_challengeId].acceptingTeam);
    // }

    function deleteChallenge(uint256 _challengeId) public {
        // Check
        require(matchChallenges[_challengeId].finished == false, "Challenge has already been finished!");
        require(matchChallenges[_challengeId].started == false, "Challenge has already been started!");
        require(
            msg.sender == matchChallenges[_challengeId].team1 || msg.sender == matchChallenges[_challengeId].team2
                || msg.sender == matchChallenges[_challengeId].referee,
            "You're not any of the teams nor the location provider!"
        );

        // Effect
        matchChallenges[_challengeId].finished = true;
        // Interact
        (bool success,) =
            payable(matchChallenges[_challengeId].team1).call{value: matchChallenges[_challengeId].amount}("");
        require(success, "Sportsbook: Transfer to team1 failed.");
        if (matchChallenges[_challengeId].accepted == true) {
            (bool success2,) =
                payable(matchChallenges[_challengeId].team2).call{value: matchChallenges[_challengeId].amount}("");
            require(success2, "Sportsbook: Transfer to team2 failed.");
        }
    }

    function viewMatchChallenge(uint256 _id) public view returns (address[3] memory) {
        address team1 = matchChallenges[_id].team1;
        address team2 = matchChallenges[_id].team2;
        address referee = matchChallenges[_id].referee;
        address[3] memory answer = [team1, team2, referee];
        return answer;
    }

    function isMatchAccepted(uint256 _id) public view returns (bool) {
        return matchChallenges[_id].accepted;
    }

    function isMatchStarted(uint256 _id) public view returns (bool) {
        return matchChallenges[_id].started;
    }

    function isMatchFinished(uint256 _id) public view returns (bool) {
        return matchChallenges[_id].finished;
    }

    uint256 numberOne = 1;

    function setNumberOne(uint256 newNumberOne) public {
        numberOne = newNumberOne;
    }

    function viewNumberOne() public view returns (uint256) {
        return numberOne;
    }
}
