import React from "react";
import { useEffect, useState } from "react";
import { Box, Button, Card, CardBody, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { ChallengeCanceledProps, ChallengeResultProps, MyChallengeCreatedProps } from "~~/types/SportsbookTypes";

const ShowChallengeCreated = ({ challenge, challengeId, team1, team2, bet }: MyChallengeCreatedProps) => {
  const [updateRefereeAddress, setUpdateRefereeAddress] = useState<string>("");
  const [completeChallengeTeam1Score, setCompleteChallengeTeam1Score] = useState<string>("");
  const [completeChallengeTeam2Score, setCompleteChallengeTeam2Score] = useState<string>("");
  const [challengeResults, setChallengeResults] = useState<ChallengeResultProps[]>([]);
  const [challengeCanceled, setChallengeCanceled] = useState<ChallengeCanceledProps[]>([]);

  const { address } = useAccount();

  const { data: ChallengeCanceled } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  useEffect(() => {
    setChallengeCanceled(
      ChallengeCanceled?.map(event => {
        if (event.args[0].toString() === challenge.challengeId.toString()) {
          return {
            challengeId: event.args[0].toString(),
            canceledBy: event.args[1].toString(),
          } as ChallengeCanceledProps;
        } else {
          console.log("Challenge ID does not match");
          return null;
        }
      }).filter(Boolean) as ChallengeCanceledProps[],
    );
  }, [ChallengeCanceled]);

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    listener: (challengeId, canceledBy) => {
      const newChallengeId = parseInt(challenge.challengeId.toString());
      setChallengeCanceled(prev => {
        if (!prev) prev = [];
        if (prev.some(e => e.challengeId === newChallengeId)) return prev;
        const newChallenge = {
          challengeId: newChallengeId,
          canceledBy: canceledBy,
        } as ChallengeCanceledProps;
        return [newChallenge, ...prev];
      });
    },
  });

  const { data: ChallengeResult } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  useEffect(() => {
    setChallengeResults(
      ChallengeResult?.map(event => {
        if (event.args[0].toString() === challengeId.toString()) {
          console.log("Challenge ID match");
          return {
            challengeId: event.args[0].toString(),
            team1: event.args[1],
            team2: event.args[2],
            team1Result: event.args[3],
            team2Result: event.args[4],
          } as ChallengeResultProps;
        } else {
          console.log("Challenge ID does not match");
          return null;
        }
      }).filter(Boolean) as ChallengeResultProps[],
    );
  }, [ChallengeResult]);

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    listener: (challengeId, team1, team2, team1Result, team2Result) => {
      const newChallengeId = parseInt(challengeId.toString());

      setChallengeResults(prev => {
        if (!prev) prev = [];
        if (prev.some(e => e.challengeId === newChallengeId)) return prev;

        const newChallenge = {
          challengeId: newChallengeId,
          team1: team1,
          team2: team2,
          team1Result: parseInt(team1Result.toString()),
          team2Result: parseInt(team2Result.toString()),
        } as ChallengeResultProps;
        return [newChallenge, ...prev];
      });
    },
  });

  const { writeAsync: acceptChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "acceptChallenge",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : BigNumber.from(0)],
    value: bet ? ethers.utils.formatEther(bet.toString()) : undefined,
  });

  const { writeAsync: deleteChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "deleteChallenge",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : BigNumber.from(0)],
  });

  const { writeAsync: startChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "startChallenge",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  const { writeAsync: completeChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "completeChallenge",
    args: [
      challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined,
      completeChallengeTeam1Score ? parseInt(completeChallengeTeam1Score) : undefined,
      completeChallengeTeam2Score ? parseInt(completeChallengeTeam2Score) : undefined,
    ],
  });

  const { writeAsync: updateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "updateReferee",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : BigNumber.from(0), updateRefereeAddress],
  });

  const { writeAsync: answerNoToUpdateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "answerUpdateReferee",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined, false],
  });

  const { writeAsync: answerYesToUpdateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "answerUpdateReferee",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined, true],
  });

  const { data: viewMatchReferee } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewMatchReferee",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  const { data: viewUpdateRefereeState } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewUpdateRefereeState",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  const { data: viewRequestedReferee } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewRequestedReferee",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  const { data: viewUpdateRefereeProposingTeam } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewUpdateRefereeProposingTeam",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  const { data: viewMatchState } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewMatchState",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  return (
    <div key={challengeId}>
      <Card
        size={"md"}
        width={"xl"}
        backgroundColor={"orange.500"}
        marginTop={4}
        textAlign={"center"}
        textColor={"white"}
      >
        <Stack>
          <CardBody margin={0}>
            <Heading size={"md"}>Challenge ID: #{challenge.challengeId}</Heading>
            {viewMatchState == 3 ? (
              <>
                {challengeResults && challengeResults.length > 0 && (
                  <>
                    <Flex justifyContent={"space-around"} marginBottom={0}>
                      <Box className="flex items-center justify-center space-x-2" margin={0}>
                        <Address address={challengeResults[0].team1} />
                        <Text> scored: {challengeResults[0].team1Result}</Text>
                      </Box>
                      <Box className="flex items-center justify-center space-x-2" margin={0}>
                        <Address address={challengeResults[0].team2} />
                        <Text> scored: {challengeResults[0].team2Result}</Text>
                      </Box>
                    </Flex>
                    {challengeResults[0].team1Result > challengeResults[0].team2Result ? (
                      <>
                        <Text fontWeight={"bold"} fontSize={"xl"} marginBottom={0} marginTop={0}>
                          Team 1 won!
                        </Text>
                        <Text fontSize={"md"} marginTop={0}>
                          The {parseFloat(ethers.utils.formatEther((bet * 2).toString())).toFixed(4)} ETH prize is
                          theirs!
                        </Text>
                      </>
                    ) : challengeResults[0].team1Result < challengeResults[0].team2Result ? (
                      <>
                        <Text fontWeight={"bold"} fontSize={"xl"} marginBottom={0}>
                          Team 2 won!
                        </Text>
                        <Text fontSize={"md"} marginTop={0}>
                          The {parseFloat(ethers.utils.formatEther((bet * 2).toString())).toFixed(4)} ETH prize is
                          theirs!
                        </Text>
                      </>
                    ) : (
                      <Text>It&apos;s a tie!</Text>
                    )}
                  </>
                )}

                {challengeCanceled && challengeCanceled.length > 0 && (
                  <Box className="flex items-center justify-center space-x-2" margin={0}>
                    <Text>Match was canceled by </Text>
                    <Address address={challengeCanceled[0].canceledBy} />
                  </Box>
                )}
              </>
            ) : (
              <>
                <Box className="flex items-center justify-center space-x-2" margin={0}>
                  <Address address={team1} />
                  <p>has challenged</p>
                  <Address address={team2} />
                </Box>
                <Text margin={0}>
                  to a $SPORT match{" "}
                  <strong>
                    betting {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0} ETH
                    each
                  </strong>
                </Text>
                <Box className="flex items-center justify-center space-x-2">
                  <Address address={viewMatchReferee} />
                  <p>will be the referee for the match</p>
                </Box>
              </>
            )}

            {viewMatchState == 3 ? (
              <></>
            ) : (
              <>
                <Flex justifyContent={"space-around"}>
                  {address == team2 && viewMatchState !== undefined && viewMatchState < 1 && (
                    <Button onClick={() => acceptChallenge()} backgroundColor={"green"} textColor={"white"}>
                      Accept challenge <br />
                      (Bet {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0} ETH)
                    </Button>
                  )}
                  {(address == team1 || address == team2) && viewMatchState !== undefined && viewMatchState < 2 && (
                    <Button onClick={() => deleteChallenge()} backgroundColor={"red"} textColor={"white"}>
                      Delete and refund
                    </Button>
                  )}
                  {address == viewMatchReferee && viewMatchState == 1 && (
                    <Button onClick={() => startChallenge()} backgroundColor={"blue"} textColor={"white"}>
                      Start challenge
                    </Button>
                  )}
                </Flex>
                <br />
                {address == viewMatchReferee && viewMatchState == 2 && (
                  <Flex justifyContent={"space-evenly"} gap={3}>
                    <Input
                      backgroundColor={"blue.900"}
                      placeholder="Team 1 score"
                      width={"30%"}
                      value={completeChallengeTeam1Score}
                      onChange={event => {
                        const newValue = event.target.value;
                        if (newValue) {
                          setCompleteChallengeTeam1Score(newValue);
                        } else {
                          setCompleteChallengeTeam1Score("");
                        }
                      }}
                    />

                    <Input
                      backgroundColor={"blue.900"}
                      width={"30%"}
                      placeholder="Team 2 score"
                      value={completeChallengeTeam2Score}
                      onChange={event => {
                        const newValue = event.target.value;
                        if (newValue) {
                          setCompleteChallengeTeam2Score(newValue);
                        } else {
                          setCompleteChallengeTeam2Score("");
                        }
                      }}
                    />
                    <Button
                      onClick={() => completeChallenge()}
                      backgroundColor={"blue"}
                      width={"20%"}
                      textColor={"white"}
                    >
                      Set score
                    </Button>
                  </Flex>
                )}
              </>
            )}
            {/* Here comes the accordion! */}
            <Accordion marginTop={4} backgroundColor={"orange.700"} textColor={"white"}>
              {(address == team1 || address == team2) && viewMatchState !== undefined && viewMatchState < 2 && (
                <AccordionItem>
                  <h2>
                    <AccordionButton backgroundColor={viewUpdateRefereeState == 1 ? "blue.600" : "orange.800"}>
                      <Box as="span" flex="1" textAlign="left">
                        Update referee
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  {(viewUpdateRefereeState == 0 || viewUpdateRefereeState == undefined) && (
                    <AccordionPanel pb={4}>
                      Don&apos;t like the current referee? Propose a new one!
                      <Flex justifyContent={"space-around"} marginTop={4}>
                        <>
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
                          <Button onClick={updateReferee} backgroundColor={"blue.600"} textColor={"white"}>
                            Propose new referee
                          </Button>
                        </>
                      </Flex>
                    </AccordionPanel>
                  )}
                  {viewUpdateRefereeState == 1 && (
                    <AccordionPanel pb={4}>
                      <Box className="flex items-center justify-center space-x-2" margin={0}>
                        <Address address={viewUpdateRefereeProposingTeam} />
                        <p>has proposed</p>
                        <Address address={viewRequestedReferee} />
                        <p>as a new referee</p>
                      </Box>
                      {viewUpdateRefereeProposingTeam != address && (
                        <Flex justifyContent={"space-around"}>
                          <Button onClick={answerYesToUpdateReferee} backgroundColor={"green.500"} textColor={"white"}>
                            Accept new referee
                          </Button>
                          <Button onClick={answerNoToUpdateReferee} backgroundColor={"red.500"} textColor={"white"}>
                            Decline proposal
                          </Button>
                        </Flex>
                      )}
                    </AccordionPanel>
                  )}
                </AccordionItem>
              )}

              <AccordionItem>
                <h2>
                  <AccordionButton backgroundColor={"orange.800"} textColor={"white"}>
                    <Box as="span" flex="1" textAlign="left">
                      About this match
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {viewMatchState == 3 ? (
                    <>
                      <Box className="flex items-center justify-center space-x-2" margin={0}>
                        <Address address={team2} />
                        <p>was challenged by</p>
                        <Address address={team1} />
                      </Box>
                      <Text margin={0}>
                        to a $SPORT match{" "}
                        <strong>
                          betting {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0}{" "}
                          ETH each
                        </strong>
                      </Text>
                      <Box className="flex items-center justify-center space-x-2">
                        <Address address={viewMatchReferee} />
                        <p>was the referee and set the score</p>
                      </Box>
                    </>
                  ) : (
                    <>
                      <p>Match hasn&apos;t finished yet</p>
                    </>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Stack>
      </Card>
    </div>
  );
};

export default ShowChallengeCreated;
