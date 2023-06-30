// import Link from "next/link";
import { useState } from "react";
import { Switch } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address, AddressInput, Balance, EtherInput, IntegerInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data: sportsbookInfo } = useDeployedContractInfo("Sportsbook");

  const [createChallengeTeam2Address, setCreateChallengeTeam2Address] = useState<string | undefined>("");
  const [createChallengeRefereeAddress, setCreateChallengeRefereeAddress] = useState<string | undefined>("");
  const [createChallengeValue, setCreateChallengeValue] = useState<string>("");
  const [acceptChallengeId, setAcceptChallengeId] = useState<string>("");
  const [acceptChallengeValue, setAcceptChallengeValue] = useState<string>("");
  const [startChallengeId, setStartChallengeId] = useState<string>("");
  const [completeChallengeId, setCompleteChallengeId] = useState<string>("");
  const [completeChallengeTeam1Score, setCompleteChallengeTeam1Score] = useState<string>("");
  const [completeChallengeTeam2Score, setCompleteChallengeTeam2Score] = useState<string>("");
  const [updateRefereeId, setUpdateRefereeId] = useState<string>("");
  const [updateRefereeAddress, setUpdateRefereeAddress] = useState<string>("");
  const [answerUpdateRefereeId, setAnswerUpdateRefereeId] = useState<string>("");
  const [answerUpdateRefereeChoice, setAnswerUpdateRefereeChoice] = useState<boolean>(false);

  const { data: viewMatchBet } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewMatchBet",
    args: [acceptChallengeId ? BigNumber.from(acceptChallengeId) : undefined],
  });

  const { data: viewRequestedReferee } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewRequestedReferee",
    args: [answerUpdateRefereeId ? BigNumber.from(answerUpdateRefereeId) : undefined],
  });

  const { writeAsync: createChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "createChallenge",
    args: [createChallengeTeam2Address, createChallengeRefereeAddress],
    value: createChallengeValue ? createChallengeValue : undefined,
  });

  const { writeAsync: acceptChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "acceptChallenge",
    args: [acceptChallengeId ? BigNumber.from(acceptChallengeId) : undefined],
    value: acceptChallengeValue ? acceptChallengeValue.toString() : undefined,
  });

  const { writeAsync: deleteChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "deleteChallenge",
    args: [acceptChallengeId ? BigNumber.from(acceptChallengeId) : undefined],
  });

  const { writeAsync: startChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "startChallenge",
    args: [startChallengeId ? BigNumber.from(startChallengeId) : undefined],
  });

  const { writeAsync: completeChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "completeChallenge",
    args: [
      completeChallengeId ? BigNumber.from(completeChallengeId) : undefined,
      completeChallengeTeam1Score ? parseInt(completeChallengeTeam1Score) : undefined,
      completeChallengeTeam2Score ? parseInt(completeChallengeTeam2Score) : undefined,
    ],
  });

  const { writeAsync: updateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "updateReferee",
    args: [updateRefereeId ? BigNumber.from(updateRefereeId) : undefined, updateRefereeAddress],
  });

  const { writeAsync: answerUpdateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "answerUpdateReferee",
    args: [answerUpdateRefereeId ? BigNumber.from(answerUpdateRefereeId) : undefined, answerUpdateRefereeChoice],
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 text-center mb-8">
        <div className="px-5">
          <div className="flex flex-col items-center justify-center w-full flex-grow">
            <h2 className="mt-2">Current user</h2>
            <Address address={address} />
            <Balance address={address} />
            <h2>Sportsbook contract</h2>
            <Address address={sportsbookInfo?.address} />
            <Balance address={sportsbookInfo?.address} />
            <h2 className="mt-2 font-bold">Create challenge</h2>
            Enter the address of who you wanna challenge
            <AddressInput
              placeholder="Enter address for team 2"
              onChange={setCreateChallengeTeam2Address}
              value={createChallengeTeam2Address ?? ""}
            />
            Referee will put the correct result of the match, and get paid his commission
            <AddressInput
              placeholder="Enter address for referee"
              onChange={setCreateChallengeRefereeAddress}
              value={createChallengeRefereeAddress ?? ""}
            />
            Enter here how much ETH you want to bet, <br />
            your oponent will have to pay the same amount to be able to accept
            <EtherInput
              placeholder="Enter your bet amount in ETH or USD"
              onChange={newValue => {
                if (newValue) {
                  setCreateChallengeValue(newValue);
                } else {
                  setCreateChallengeValue("");
                }
              }}
              value={createChallengeValue}
            />
            <button className="btn btn-primary" onClick={createChallenge}>
              Create challenge
            </button>
            <h2 className="mt-10 font-bold">Accept challenge</h2>
            <span className="text-sm">
              Amount bet in this match:{" "}
              {viewMatchBet ? parseFloat(ethers.utils.formatEther(viewMatchBet)).toFixed(4) : 0} ETH
            </span>
            <IntegerInput
              placeholder="Enter challenge ID"
              value={acceptChallengeId}
              onChange={newValue => {
                if (newValue) {
                  setAcceptChallengeId(newValue.toString());
                } else {
                  setAcceptChallengeId("");
                }
              }}
            />
            <EtherInput
              placeholder="Enter same bet amount for this match"
              onChange={newValue => {
                if (newValue) {
                  setAcceptChallengeValue(newValue);
                } else {
                  setAcceptChallengeValue("");
                }
              }}
              value={acceptChallengeValue}
            />
            <button className="btn btn-primary" onClick={acceptChallenge}>
              Accept challenge
            </button>
            <button className="btn btn-primary" onClick={deleteChallenge}>
              Cancel challenge
            </button>
            <h2 className="mt-10 font-bold">Start challenge</h2>
            <span className="text-sm">Exists?: </span>
            <span className="text-sm">Has started?: </span>
            <IntegerInput
              placeholder="Enter challenge ID"
              value={startChallengeId}
              onChange={newValue => {
                if (newValue) {
                  setStartChallengeId(newValue.toString());
                } else {
                  setStartChallengeId("");
                }
              }}
            />
            <button className="btn btn-primary" onClick={startChallenge}>
              Start challenge
            </button>
            <h2 className="mt-10 font-bold">Complete challenge</h2>
            <IntegerInput
              placeholder="Enter challenge ID"
              value={completeChallengeId}
              onChange={newValue => {
                if (newValue) {
                  setCompleteChallengeId(newValue.toString());
                } else {
                  setCompleteChallengeId("");
                }
              }}
            />
            <IntegerInput
              placeholder="Enter score for team 1"
              value={completeChallengeTeam1Score}
              onChange={newValue => {
                if (newValue) {
                  setCompleteChallengeTeam1Score(newValue.toString());
                } else {
                  setCompleteChallengeTeam1Score("");
                }
              }}
            />
            <IntegerInput
              placeholder="Enter score for team 2"
              value={completeChallengeTeam2Score}
              onChange={newValue => {
                if (newValue) {
                  setCompleteChallengeTeam2Score(newValue.toString());
                } else {
                  setCompleteChallengeTeam2Score("");
                }
              }}
            />
            <button className="btn btn-primary" onClick={completeChallenge}>
              Complete challenge
            </button>
            <h2 className="mt-10 font-bold">Create &quot;update referee&quot; request</h2>
            <IntegerInput
              placeholder="Enter challenge ID"
              value={updateRefereeId}
              onChange={newValue => {
                if (newValue) {
                  setUpdateRefereeId(newValue.toString());
                } else {
                  setUpdateRefereeId("");
                }
              }}
            />
            <AddressInput
              placeholder="Enter address for new referee"
              value={updateRefereeAddress}
              onChange={newValue => {
                if (newValue) {
                  setUpdateRefereeAddress(newValue.toString());
                } else {
                  setUpdateRefereeAddress("");
                }
              }}
            />
            <button className="btn btn-primary" onClick={updateReferee}>
              Create request
            </button>
            <h2 className="mt-10 font-bold">Answer &quot;update referee&quot; request</h2>
            <IntegerInput
              placeholder="Enter challenge ID"
              value={answerUpdateRefereeId}
              onChange={newValue => {
                if (newValue) {
                  setAnswerUpdateRefereeId(newValue.toString());
                } else {
                  setAnswerUpdateRefereeId("");
                }
              }}
            />
            <span className="text-sm">Requested change to this referee: {viewRequestedReferee}</span>
            <span className="text-sm">Do you accept the new referee?: </span>
            <Switch
              className="mb-2"
              id="answer-update-choice"
              checked={answerUpdateRefereeChoice}
              onChange={event => setAnswerUpdateRefereeChoice(event.target.checked)}
            />
            <button className="btn btn-primary" onClick={answerUpdateReferee}>
              Answer request
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
