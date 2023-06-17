// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

struct MatchChallenge {
    address team1;
    address team2;
    bool accepted;
    bool started;
    bool finished;
    uint256 amount;
    address locationProvider;
}

contract SportsbookBase {
    MatchChallenge[] public matchChallenges;

    event ChallengeResult(
        uint256 indexed MatchChallengeId,
        uint8 team1Result,
        uint8 team2Result
    );

    constructor() payable {}

    function createChallenge(
        address _team2,
        address locationProvider
    ) public payable {
        matchChallenges.push(
            MatchChallenge(
                msg.sender,
                _team2,
                false,
                false,
                false,
                msg.value,
                locationProvider
            )
        );
    }

    function acceptChallenge(uint256 _challengeId) public payable {
        require(
            msg.sender == matchChallenges[_challengeId].team2,
            "You're not the challenged team!"
        );
        require(
            msg.value >= matchChallenges[_challengeId].amount,
            "Haven't sent enough ETH!"
        );
        matchChallenges[_challengeId].accepted = true;
    }

    function updateChallengedTeam(
        uint256 _challengeId,
        address _newTeam2
    ) public {
        require(
            msg.sender == matchChallenges[_challengeId].team1,
            "You're not the team1!"
        );
        require(
            matchChallenges[_challengeId].accepted != true,
            "Challenge has already been accepted!"
        );

        matchChallenges[_challengeId].team2 = _newTeam2;
    }

    function updateLocationProvider(
        uint256 _challengeId,
        address _newLocationProvider
    ) public {
        require(
            msg.sender == matchChallenges[_challengeId].team1 ||
                msg.sender == matchChallenges[_challengeId].team2,
            "You're not any of the teams!"
        );
        require(
            matchChallenges[_challengeId].started != true,
            "Challenge has already been started!"
        );

        matchChallenges[_challengeId].locationProvider = _newLocationProvider;
    }

    // function acceptUpdateLocationProvider(uint256 _challengeId) public {
    //     require(msg.sender == matchChallenges[_challengeId].acceptingTeam);
    // }

    function deleteChallenge(uint256 _challengeId) public {
        // Check
        require(
            matchChallenges[_challengeId].finished == false,
            "Challenge has already been finished!"
        );
        require(
            matchChallenges[_challengeId].started == false,
            "Challenge has already been started!"
        );
        require(
            msg.sender == matchChallenges[_challengeId].team1 ||
                msg.sender == matchChallenges[_challengeId].team2 ||
                msg.sender == matchChallenges[_challengeId].locationProvider,
            "You're not any of the teams nor the location provider!"
        );

        // Effect
        matchChallenges[_challengeId].finished = true;
        // Interact
        (bool success, ) = payable(matchChallenges[_challengeId].team1).call{
            value: matchChallenges[_challengeId].amount
        }("");
        if (matchChallenges[_challengeId].accepted == true) {
            (bool success2, ) = payable(matchChallenges[_challengeId].team2)
                .call{value: matchChallenges[_challengeId].amount}("");
        }
    }

    function startChallenge(uint256 _challengeId) public {
        // Check
        require(
            matchChallenges[_challengeId].accepted == true,
            "Team2 hasn't accepted the challenge!"
        );
        require(
            matchChallenges[_challengeId].locationProvider == msg.sender,
            "You're not the location provider!"
        );
        require(
            matchChallenges[_challengeId].team2 != address(0),
            "Lacking a team or match canceled"
        );

        // Effect
        matchChallenges[_challengeId].started = true;
    }

    function completeChallenge(
        uint256 _challengeId,
        uint8 _team1Result,
        uint8 _team2Result
    ) public {
        // Check
        require(
            matchChallenges[_challengeId].started == true,
            "Challenge hasn't started!"
        );
        require(
            matchChallenges[_challengeId].finished == false,
            "Challenge already completed"
        );
        require(
            matchChallenges[_challengeId].team2 != address(0),
            "There must be a team2!"
        );
        require(
            msg.sender == matchChallenges[_challengeId].locationProvider,
            "You must be the location provider to say who won"
        );
        // Effect
        matchChallenges[_challengeId].finished = true;
        emit ChallengeResult(_challengeId, _team1Result, _team2Result);
        // Interact
        if (_team1Result > _team2Result) {
            (bool success, ) = payable(matchChallenges[_challengeId].team1)
                .call{value: matchChallenges[_challengeId].amount * 2}("");
        }
        if (_team1Result < _team2Result) {
            (bool success, ) = payable(matchChallenges[_challengeId].team2)
                .call{value: matchChallenges[_challengeId].amount * 2}("");
        }
        if (_team1Result == _team2Result) {
            (bool success, ) = payable(matchChallenges[_challengeId].team1)
                .call{value: matchChallenges[_challengeId].amount}("");
            (bool success2, ) = payable(matchChallenges[_challengeId].team2)
                .call{value: matchChallenges[_challengeId].amount}("");
        }
    }

    function viewMatchChallenge(
        uint256 _id
    ) public view returns (address[3] memory) {
        address team1 = matchChallenges[_id].team1;
        address team2 = matchChallenges[_id].team2;
        address locationProvider = matchChallenges[_id].locationProvider;
        address[3] memory answer = [team1, team2, locationProvider];
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
}
