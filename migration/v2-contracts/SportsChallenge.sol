// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LoseNft.sol";
import "./TieNft.sol";
import "./WinNft.sol";

enum MatchStatus {
    PENDING,
    ACCEPTED,
    STARTED,
    ENDED
}

struct MatchChallenge {
    uint256 matchId;
    address team1;
    address team2;
    MatchStatus matchStatus;
    uint256 amount;
    address locationProvider;
}

contract SportsChallenges is Ownable {
    /* State variables */
    MatchChallenge[] public matchChallenges; // Contiene el numero de desafios
    uint256 public totalMatchesPlayed;
    uint256 public locationProviderFee;
    uint256 public contractOwnerFee;
    uint256 public contractWithdrawableAmount;

    LoseNft public loseNft =
        LoseNft(0xbA165D3C346e68A96f5722bfD03727011d6Ec839);
    TieNft public tieNft = TieNft(0xCcc368eA70Bfbaa16eDb80418B090C8baF9801c4);
    WinNft public winNft = WinNft(0x5CA8559e7502Cec1Bba61D3e3ab6F38820f7d9C8);

    mapping(address => uint256) public unclaimedTeamPrize;
    mapping(address => uint256) public unclaimedLocationProviderAmount;
    /* Events */
    // Evento que salta cuando el LocationProvider define el final
    event NewChallenge(
        uint256 indexed MatchChallengeId,
        address indexed team1,
        address indexed team2,
        uint256 amount
    );

    event ChallengeAccepted(
        uint256 indexed MatchChallengeId,
        address indexed team1,
        address indexed team2
    );

    event ChallengeResult(
        uint256 indexed MatchChallengeId,
        uint8 team1Result,
        uint8 team2Result
    );

    constructor(uint256 _locationProviderFee, uint256 _contractOwnerFee) {
        locationProviderFee = _locationProviderFee;
        contractOwnerFee = _contractOwnerFee;
    }

    function createChallenge(address _team2, address _locationProvider)
        public
        payable
    {
        require(
            msg.value >= (locationProviderFee + contractOwnerFee),
            "Didn't send enough ETH to cover the minimum cost!"
        );
        matchChallenges.push(
            MatchChallenge(
                totalMatchesPlayed,
                msg.sender,
                _team2,
                MatchStatus.PENDING,
                msg.value,
                _locationProvider
            )
        );
        totalMatchesPlayed += 1;
        //     emit NewChallenge(
        //     MatchChallengeId????,
        //      msg.sender,
        //      _team2,
        //      msg.value
        // );
    }

    /* Write functions */
    // Acepta el desafio
    function acceptChallenge(uint256 _challengeId) public payable {
        require(
            msg.sender == matchChallenges[_challengeId].team2,
            "You're not the challenged team!"
        );
        require(
            msg.value >= matchChallenges[_challengeId].amount,
            "Haven't sent enough ETH!"
        );
        matchChallenges[_challengeId].matchStatus = MatchStatus.ACCEPTED;
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
            matchChallenges[_challengeId].matchStatus >= MatchStatus.STARTED,
            "Challenge has already been started!"
        );

        matchChallenges[_challengeId].locationProvider = _newLocationProvider;
    }

    function deleteChallenge(uint256 _challengeId) public {
        require(
            matchChallenges[_challengeId].matchStatus < MatchStatus.STARTED,
            "Challenge has already been started or finished!"
        );
        require(
            msg.sender == matchChallenges[_challengeId].team1 ||
                msg.sender == matchChallenges[_challengeId].team2 ||
                msg.sender == matchChallenges[_challengeId].locationProvider,
            "You're not any of the teams nor the location provider!"
        );

        unclaimedTeamPrize[
            matchChallenges[_challengeId].team1
        ] += matchChallenges[_challengeId].amount;
        if (matchChallenges[_challengeId].matchStatus == MatchStatus.ACCEPTED) {
            unclaimedTeamPrize[
                matchChallenges[_challengeId].team2
            ] += matchChallenges[_challengeId].amount;
        }
        matchChallenges[_challengeId].matchStatus = MatchStatus.ENDED;
        // Reentrant vulnerable, fix later
    }

    function startChallenge(uint256 _challengeId) public {
        // Check
        require(
            matchChallenges[_challengeId].matchStatus == MatchStatus.ACCEPTED,
            "Team2 hasn't accepted the challenge or it has already started!"
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
        matchChallenges[_challengeId].matchStatus = MatchStatus.STARTED;
    }

    function completeChallenge(
        uint256 _challengeId,
        uint8 _team1Result,
        uint8 _team2Result
    ) public {
        // Check
        require(
            matchChallenges[_challengeId].matchStatus == MatchStatus.STARTED,
            "Challenge hasn't started!"
        );
        require(
            msg.sender == matchChallenges[_challengeId].locationProvider,
            "You must be the location provider to say who won"
        );
        // Effect
        matchChallenges[_challengeId].matchStatus = MatchStatus.ENDED;
        emit ChallengeResult(_challengeId, _team1Result, _team2Result);
        // Interact
        uint256 prizeMinusLocationFee = (matchChallenges[_challengeId].amount *
            2) - (locationProviderFee + contractOwnerFee);
        contractWithdrawableAmount += contractOwnerFee;
        unclaimedLocationProviderAmount[
            matchChallenges[_challengeId].locationProvider
        ] += locationProviderFee;

        if (_team1Result > _team2Result) {
            unclaimedTeamPrize[
                matchChallenges[_challengeId].team1
            ] += prizeMinusLocationFee;
            loseNft.mintNft(matchChallenges[_challengeId].team2);
            winNft.mintNft(matchChallenges[_challengeId].team1);
        }
        if (_team1Result < _team2Result) {
            unclaimedTeamPrize[
                matchChallenges[_challengeId].team2
            ] += prizeMinusLocationFee;
            loseNft.mintNft(matchChallenges[_challengeId].team1);
            winNft.mintNft(matchChallenges[_challengeId].team2);
        }
        if (_team1Result == _team2Result) {
            unclaimedTeamPrize[
                matchChallenges[_challengeId].team1
            ] += (prizeMinusLocationFee / 2);
            unclaimedTeamPrize[
                matchChallenges[_challengeId].team2
            ] += (prizeMinusLocationFee / 2);
            tieNft.mintNft(matchChallenges[_challengeId].team1);
            tieNft.mintNft(matchChallenges[_challengeId].team2);
        }
    }

    function claimPrize() public {
        // Check
        require(
            unclaimedTeamPrize[msg.sender] > 0,
            "You don't have any prizes to claim!"
        );
        // Effect
        unclaimedTeamPrize[msg.sender] = 0;
        // Interact
        (bool success, ) = msg.sender.call{
            value: unclaimedTeamPrize[msg.sender]
        }("");
        require(success, "ETH didn't send successfully!");
    }

    function claimLocationProviderWinnings() public {
        // Check
        require(
            unclaimedLocationProviderAmount[msg.sender] > 0,
            "You don't have any winnings to claim!"
        );
        // Effect
        unclaimedLocationProviderAmount[msg.sender] = 0;
        // Interact
        (bool success, ) = msg.sender.call{
            value: unclaimedLocationProviderAmount[msg.sender]
        }("");
        require(success, "ETH didn't send successfully!");
    }

    function withdraw(uint256 _amount) external onlyOwner {
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "ETH didn't send successfully!");
    }

    function setLocationProviderFee(uint256 _newAmount) external onlyOwner {
        require(
            _newAmount >= contractOwnerFee,
            "Location provider fee must be bigger than contract owner fee!"
        );
        locationProviderFee = _newAmount;
    }

    function setContractOwnerFee(uint256 _newAmount) external onlyOwner {
        require(
            _newAmount <= locationProviderFee,
            "Contract owner fee must be smaller than location provider fee!"
        );
        contractOwnerFee = _newAmount;
    }

    /* Read functions */

    function viewMatchChallenge(uint256 _id)
        public
        view
        returns (address[3] memory)
    {
        address team1 = matchChallenges[_id].team1;
        address team2 = matchChallenges[_id].team2;
        address locationProvider = matchChallenges[_id].locationProvider;
        address[3] memory answer = [team1, team2, locationProvider];
        return answer;
    }

    function viewMatchStatus(uint256 _id) public view returns (MatchStatus) {
        return matchChallenges[_id].matchStatus;
    }

    function viewUnclaimedPrize() public view returns (uint256) {
        return unclaimedTeamPrize[msg.sender];
    }

    function getAllMatches() public view returns (MatchChallenge[] memory) {
        return matchChallenges;
    }

    function viewLocationProviderWithdrawableAmount()
        public
        view
        returns (uint256)
    {
        return unclaimedLocationProviderAmount[msg.sender];
    }

    function viewMatchFee() public view returns (uint256) {
        return (contractOwnerFee + locationProviderFee);
    }
}
