import React from "react";
import { useState } from "react";
import { Box, Button, Card, CardBody, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { MyChallengeCreatedProps } from "~~/types/SportsbookTypes";

const ShowChallengeCreated = ({ challenge, challengeId, team1, team2, bet }: MyChallengeCreatedProps) => {
  const [updateRefereeAddress, setUpdateRefereeAddress] = useState<string>("");
  const [completeChallengeTeam1Score, setCompleteChallengeTeam1Score] = useState<string>("");
  const [completeChallengeTeam2Score, setCompleteChallengeTeam2Score] = useState<string>("");

  const { address } = useAccount();

  console.log("Referee", challenge.referee);

  const { data: viewRequestedReferee } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewRequestedReferee",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
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
            <Box className="flex items-center justify-center space-x-2" margin={0}>
              {viewMatchState == 3 ? (
                <>
                  <Address address={team2} />
                  <p>was challenged by</p>
                  <Address address={team1} />
                </>
              ) : (
                <>
                  <Address address={team1} />
                  <p>has challenged</p>
                  <Address address={team2} />
                </>
              )}
            </Box>
            <Text margin={0}>
              to a $SPORT match{" "}
              <strong>
                betting {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0} ETH
              </strong>
            </Text>

            <Box className="flex items-center justify-center space-x-2">
              {viewMatchState == 3 ? (
                <>
                  <Address address={viewMatchReferee} />
                  <p>was the referee and set the score for the match</p>
                </>
              ) : (
                <>
                  <Address address={viewMatchReferee} />
                  <p>will be the referee for the match</p>
                </>
              )}
            </Box>
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
                  {address == viewMatchReferee && viewMatchState !== undefined && viewMatchState < 2 && (
                    <Button onClick={() => startChallenge()} backgroundColor={"blue"} textColor={"white"}>
                      Start challenge
                    </Button>
                  )}
                </Flex>
                <br />
                {address == viewMatchReferee && (
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
                      There&apos;s a <strong>request awaiting</strong>
                      <Box className="flex items-center justify-center space-x-2" margin={0}>
                        <Address address={viewUpdateRefereeProposingTeam} />
                        <p>has proposed</p>
                        <Address address={viewRequestedReferee} />
                      </Box>
                      <Flex justifyContent={"space-around"}>
                        <Button onClick={answerYesToUpdateReferee} backgroundColor={"green.500"} textColor={"white"}>
                          Accept new referee
                        </Button>
                        <Button onClick={answerNoToUpdateReferee} backgroundColor={"red.500"} textColor={"white"}>
                          Decline proposal
                        </Button>
                      </Flex>
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
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
