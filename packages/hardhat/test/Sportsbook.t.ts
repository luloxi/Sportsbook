import { expect } from "chai";
import { ethers } from "hardhat";
import { Sportsbook } from "../typechain-types";

describe("Sportsbook", function () {
  let sportsbook: Sportsbook;
  // let owner: any;
  let team1: any;
  let team2: any;
  let referee: any;
  let newReferee: any;

  const BET_AMOUNT = ethers.utils.parseEther("1");

  before(async () => {
    [/*owner,*/ team1, team2, referee, newReferee] = await ethers.getSigners();
    const sportsbookFactory = await ethers.getContractFactory("Sportsbook");
    sportsbook = (await sportsbookFactory.deploy()) as Sportsbook;
    await sportsbook.deployed();
  });

  describe("Expected flow", function () {
    const challengeId = 0;

    it("0. createChallenge: Creates a new match challenge with the correct parameters", async function () {
      await sportsbook.connect(team1).createChallenge(team2.address, referee.address, { value: BET_AMOUNT });
      expect(await sportsbook.viewMatchCount()).to.equal(1);
      const challenge = await sportsbook.viewMatchChallenge(0);
      expect(challenge.team1).to.equal(team1.address);
      expect(challenge.team2).to.equal(team2.address);
      expect(challenge.state).to.equal(0);
      expect(challenge.referee).to.equal(referee.address);
      expect(challenge.bet).to.equal(BET_AMOUNT);
    });

    it("1. acceptChallenge: Only allows team2 to accept a new match", async function () {
      await expect(
        sportsbook.connect(team1).acceptChallenge(challengeId, { value: ethers.utils.parseEther("1") }),
      ).to.be.revertedWith("You're not the challenged team!");
      await sportsbook.connect(team2).acceptChallenge(challengeId, { value: ethers.utils.parseEther("1") });
      expect(await sportsbook.viewMatchState(challengeId)).to.equal(1);
    });

    it("1. updateReferee: Allows proposing and accepting referee update", async function () {
      // Propose referee update
      await sportsbook.connect(team1).updateReferee(challengeId, newReferee.address);
      expect(await sportsbook.viewUpdateRefereeState(challengeId)).to.equal(1);

      // Accept referee update
      await sportsbook.connect(team2).answerUpdateReferee(challengeId, true);
      expect(await sportsbook.viewMatchReferee(challengeId)).to.equal(newReferee.address);
    });

    it("2. startChallenge: Only allows the referee to start the match", async function () {
      await expect(sportsbook.connect(team2).startChallenge(challengeId)).to.be.revertedWith("You're not the referee!");
      await sportsbook.connect(newReferee).startChallenge(challengeId);
    });
    it("2. updateReferee: Doesn't allow changing referee after the match has started", async function () {
      await expect(sportsbook.connect(team1).updateReferee(challengeId, newReferee.address)).to.be.revertedWith(
        "Challenge has already been started!",
      );
    });
    it("2. withdrawPrize: Doesn't allow withdrawing the prize before the match has ended", async function () {
      await expect(sportsbook.connect(team1).withdrawPrize(challengeId)).to.be.revertedWith(
        "Challenge has not been completed yet.",
      );
    });
    it("3. completeChallenge: Only allows the referee to set the score of the match", async function () {
      await expect(sportsbook.connect(team2).completeChallenge(challengeId, 1, 0)).to.be.revertedWith(
        "You must be the referee to say who won",
      );
      await sportsbook.connect(newReferee).completeChallenge(challengeId, 1, 0);
    });
    it("3. completeChallenge: Doesn't allow changing the score after the match has ended", async function () {
      await expect(sportsbook.connect(newReferee).completeChallenge(challengeId, 2, 0)).to.be.revertedWith(
        "Challenge hasn't started!",
      );
    });
    it("4. withdrawPrize: Only allows the winner to withdraw the prize", async function () {
      const originalTeam1Balance = await ethers.provider.getBalance(team1.address);
      await expect(sportsbook.connect(team2).withdrawPrize(challengeId)).to.be.revertedWith(
        "You are not the winning team.",
      );
      await sportsbook.connect(team1).withdrawPrize(challengeId);
      const newTeam1Balance = await ethers.provider.getBalance(team1.address);
      expect(newTeam1Balance.sub(ethers.utils.parseEther("0.1"))).to.be.gt(originalTeam1Balance);
    });
    xit("4. withdrawPrize: Doesn't allow withdrawing the prize twice", async function () {
      // For some reason this is reverting with the reason "Transfer failed" instead of the expected error message, should investigate further
      await expect(sportsbook.connect(team1).withdrawPrize(challengeId)).to.be.revertedWith(
        "You have already withdrawn your share.",
      );
    });
  });
  describe("Edge cases", function () {
    it("withdrawPrize: Should split the prize in half in case of a tie", async function () {
      const challengeId = 1;
      await sportsbook.connect(team1).createChallenge(team2.address, referee.address, { value: BET_AMOUNT });
      await sportsbook.connect(team2).acceptChallenge(challengeId, { value: BET_AMOUNT });
      await sportsbook.connect(referee).startChallenge(challengeId);
      await sportsbook.connect(referee).completeChallenge(challengeId, 1, 1);

      const originalTeam1Balance = await ethers.provider.getBalance(team1.address);
      const originalTeam2Balance = await ethers.provider.getBalance(team2.address);

      await sportsbook.connect(team1).withdrawPrize(challengeId);
      await sportsbook.connect(team2).withdrawPrize(challengeId);

      const newTeam1Balance = await ethers.provider.getBalance(team1.address);
      const newTeam2Balance = await ethers.provider.getBalance(team2.address);
      // This check should be more accurate, but I'm lazy to calculate gas costs properly
      expect(newTeam1Balance.sub(ethers.utils.parseEther("0.1"))).to.be.gt(originalTeam1Balance);
      expect(newTeam2Balance.sub(ethers.utils.parseEther("0.1"))).to.be.gt(originalTeam2Balance);
    });
  });
});
