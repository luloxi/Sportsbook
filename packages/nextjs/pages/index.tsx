// import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { Switch } from "@chakra-ui/react";
import { Box, Button, Card, CardBody, CardFooter, Heading, Stack, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address, AddressInput, EtherInput, IntegerInput } from "~~/components/scaffold-eth";
import {
  // useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";
import ShowChallengeCreated from "~~/pages/sportsbook/ShowChallengeCreated";
import { ChallengeCreatedProps } from "~~/types/SportsbookTypes";

const Home: NextPage = () => {
  const { address } = useAccount();
  // const { data: sportsbookInfo } = useDeployedContractInfo("Sportsbook");

  const [challengeCreated, setChallengeCreated] = useState<ChallengeCreatedProps[]>([]);
  const [createChallengeTeam2Address, setCreateChallengeTeam2Address] = useState<string | undefined>("");
  const [createChallengeRefereeAddress, setCreateChallengeRefereeAddress] = useState<string | undefined>("");
  const [createChallengeValue, setCreateChallengeValue] = useState<string>("");
  const [startChallengeId, setStartChallengeId] = useState<string>("");
  const [completeChallengeId, setCompleteChallengeId] = useState<string>("");
  const [completeChallengeTeam1Score, setCompleteChallengeTeam1Score] = useState<string>("");
  const [completeChallengeTeam2Score, setCompleteChallengeTeam2Score] = useState<string>("");
  const [updateRefereeId, setUpdateRefereeId] = useState<string>("");
  const [updateRefereeAddress, setUpdateRefereeAddress] = useState<string>("");
  const [answerUpdateRefereeId, setAnswerUpdateRefereeId] = useState<string>("");
  const [answerUpdateRefereeChoice, setAnswerUpdateRefereeChoice] = useState<boolean>(false);

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

  const { data: ChallengeCreated } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  useEffect(() => {
    setChallengeCreated(
      ChallengeCreated?.map(event => {
        return {
          challengeId: event.args[0].toString(),
          team1: event.args[1],
          team2: event.args[2],
          bet: event.args[3],
        } as ChallengeCreatedProps;
      }) as ChallengeCreatedProps[],
    );
  }, [ChallengeCreated]);

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    listener: (challengeId, team1, team2, bet) => {
      setChallengeCreated(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (!prev) prev = [];
        if (prev.some(e => e.challengeId === newChallengeId)) return prev;

        const newChallenge = {
          challengeId: newChallengeId,
          team1: team1,
          team2: team2,
          bet: parseInt(bet.toString()),
        } as ChallengeCreatedProps;
        return [newChallenge, ...prev];
      });
    },
  });

  return (
    <>
      <MetaHeader />
      <>
        <div className="flex flex-col md:flex-row items-center justify-between flex-grow pt-10 text-center mb-8">
          <Card
            direction={{ base: "column", sm: "row" }}
            width="container.md"
            maxWidth={{ base: "container.sm", sm: "container.sm", md: "container.md" }}
            variant="outline"
            className="md:ml-4 scrollable-card"
          >
            <Stack>
              <CardBody>
                <Heading size="md">🏀 See your active challenges! ⚽</Heading>
                {challengeCreated?.map((challenge, index) => (
                  <div key={challenge.challengeId}>
                    <ShowChallengeCreated
                      challenge={challenge}
                      challengeId={index}
                      team1={challenge.team1}
                      team2={challenge.team2}
                      bet={challenge.bet}
                    />
                  </div>
                ))}
              </CardBody>
              <CardFooter>
                {/* <Button variant="solid" onClick={createChallenge} colorScheme="blue">
                  List your challenges
                </Button> */}
              </CardFooter>
            </Stack>
          </Card>
          <Card
            direction={{ base: "column", sm: "row" }}
            maxWidth={"md"}
            overflow="hidden"
            variant="outline"
            className="md:ml-4"
          >
            <Stack>
              <CardBody>
                <Heading size="xl">🏀 Challenge another team to a match! ⚽</Heading>
                <Text fontWeight={"bold"} marginBottom={0}>
                  Enter address of who you want to challenge
                </Text>
                <AddressInput
                  placeholder="Enter address for team 2"
                  onChange={setCreateChallengeTeam2Address}
                  value={createChallengeTeam2Address ?? ""}
                />
                <Box className="flex items-center justify-center space-x-2">
                  <h2 className="mt-2">Propose yourself to try it out</h2>
                  <Address address={address} />
                </Box>
                <br />
                <Text fontWeight={"bold"} marginBottom={0}>
                  Propose a referee to input the result of the match
                </Text>
                <AddressInput
                  placeholder="Enter address for referee"
                  onChange={setCreateChallengeRefereeAddress}
                  value={createChallengeRefereeAddress ?? ""}
                />
                <Box className="flex items-center justify-center">
                  <h2 className="mt-2">Set yourself as referee to try out Sportsbook</h2>
                  <Address address={address} />
                </Box>
                <br />
                <Text fontWeight={"bold"} marginBottom={0}>
                  (optional) Bet ETH on the match outcome{" "}
                </Text>
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
                your oponent will have to pay the same to accept.
                <br />
                <Text fontWeight={"bold"} mt={0}>
                  Winner gets all, Tie gives back the ETH.
                </Text>
              </CardBody>

              <CardFooter>
                <Button variant="solid" onClick={createChallenge} colorScheme="blue">
                  Create challenge
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        </div>
      </>

      <div className="flex items-center flex-col flex-grow pt-10 text-center mb-8">
        <div className="px-5">
          <div className="flex flex-col items-center justify-center w-full flex-grow">
            <h2 className="mt-2 font-bold">Create challenge</h2>
            {/* {matches && matches.length > 0 ? (
              matches.map((match, index) => (
                <div key={index}>
                  <Text>Match: {match.team1}</Text>
                  <Text>Team 1: {match.team1}</Text>
                  <Text>Team 2: {match.team2}</Text>
                  <Text>State: {match.state}</Text>
                  <Text>Bet: {match.bet}</Text>
                  <Text>Referee: {match.referee}</Text>
                </div>
              ))
            ) : (
              <Text>No matches available</Text>
            )} */}

            {/* <h2 className="mt-10 font-bold">Accept challenge</h2>
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
            </button> */}
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
