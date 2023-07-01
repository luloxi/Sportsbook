// import Link from "next/link";
// import { useAccount } from "wagmi";
import { useState } from "react";
import { useEffect } from "react";
import { Switch } from "@chakra-ui/react";
import { Button, Card, CardBody, CardFooter, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressInput, EtherInput, IntegerInput } from "~~/components/scaffold-eth";
import {
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";
import ShowChallengeCreated from "~~/pages/sportsbook/ShowChallengeCreated";
import { ChallengeCreatedProps } from "~~/types/SportsbookTypes";

const Home: NextPage = () => {
  // const { address } = useAccount();
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
        <Flex direction={{ base: "column", md: "row" }} justify="space-around" align="center" marginTop={4}>
          <Card
            direction={{ base: "column", sm: "row" }}
            width="container.sm"
            maxWidth={{ base: "container.sm", sm: "container.sm", md: "container.md" }}
            variant="solid"
            maxHeight={{ base: "container.sm", sm: "container.sm", md: "480" }}
            overflow={"auto"}
            textColor={"white"}
            backgroundColor={"orange.800"}
          >
            <Stack>
              <CardBody>
                <Heading size="xl">🏀 See your active challenges! ⚽</Heading>
                <Flex direction="column" alignItems="center" justifyContent="center">
                  {challengeCreated?.map((challenge, index) => (
                    <div key={index}>
                      <ShowChallengeCreated
                        challenge={challenge}
                        challengeId={index}
                        team1={challenge.team1}
                        team2={challenge.team2}
                        bet={challenge.bet}
                      />
                    </div>
                  ))}
                </Flex>
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
            variant="solid"
            textColor={"white"}
            marginRight={4}
            backgroundColor={"green.600"}
            textAlign={"center"}
          >
            <Stack>
              <CardBody>
                <Heading size="xl">🏀 Challenge another team to a match! ⚽</Heading>
                <Text fontWeight={"bold"} marginBottom={0}>
                  Who do you want to challenge?
                </Text>
                <AddressInput
                  placeholder="Enter address for team 2"
                  onChange={setCreateChallengeTeam2Address}
                  value={createChallengeTeam2Address ?? ""}
                />
                <br />
                <Text fontWeight={"bold"} marginBottom={0} marginTop={0}>
                  Propose a referee
                </Text>
                <AddressInput
                  placeholder="Enter address for referee"
                  onChange={setCreateChallengeRefereeAddress}
                  value={createChallengeRefereeAddress ?? ""}
                />
                <br />
                <Text fontWeight={"bold"} marginBottom={0} marginTop={0}>
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
                Your oponent will have to pay the same to accept.
                <br />
                <Text fontWeight={"bold"} mt={0} mb={0}>
                  Winner gets all, Tie gives back the ETH.
                </Text>
                <Button
                  variant="solid"
                  onClick={createChallenge}
                  backgroundColor={"orange.500"}
                  textColor={"white"}
                  colorScheme="orange"
                  marginTop={4}
                >
                  Create challenge
                </Button>
              </CardBody>
            </Stack>
          </Card>
        </Flex>
      </>

      <div className="flex items-center flex-col flex-grow pt-10 text-center mb-8">
        <div className="px-5">
          <div className="flex flex-col items-center justify-center w-full flex-grow">
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
