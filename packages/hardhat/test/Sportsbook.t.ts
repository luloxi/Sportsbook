import { expect } from "chai";
import { ethers } from "hardhat";
import { Sportsbook } from "../typechain-types";

describe("Sportsbook", function () {
  let sportsbook: Sportsbook;
  // let owner: any;
  let team1: any;
  let team2: any;
  let referee: any;

  before(async () => {
    [/*owner,*/ team1, team2, referee] = await ethers.getSigners();
    const sportsbookFactory = await ethers.getContractFactory("Sportsbook");
    sportsbook = (await sportsbookFactory.deploy()) as Sportsbook;
    await sportsbook.deployed();
  });

  describe("Basic usage", function () {
    it("Creates a new challenge", async function () {
      await sportsbook.createChallenge(team2.address, referee.address, { value: ethers.utils.parseEther("1") });
      expect(await sportsbook.viewMatchCount()).to.equal(1);
    });

    it("Allows accepting a new challenge", async function () {
      const challengeId = 0;
      await sportsbook.createChallenge(team2.address, referee.address, { value: ethers.utils.parseEther("1") });
      await sportsbook.connect(team2).acceptChallenge(challengeId, { value: ethers.utils.parseEther("1") });
      expect(await sportsbook.viewMatchState(challengeId)).to.equal(1);
    });

    it("Allows proposing and accepting referee update", async function () {
      const challengeId = 0;
      await sportsbook.createChallenge(team2.address, referee.address, { value: ethers.utils.parseEther("1") });

      // Propose referee update
      await sportsbook.updateReferee(challengeId, team1.address);
      expect(await sportsbook.viewUpdateRefereeState(challengeId)).to.equal(1);

      // Accept referee update
      await sportsbook.connect(team2).answerUpdateReferee(challengeId, true);
      expect(await sportsbook.viewMatchReferee(challengeId)).to.equal(team1.address);
    });
  });
});
