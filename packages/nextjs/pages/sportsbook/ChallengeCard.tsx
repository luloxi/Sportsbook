import { useEffect, useState } from "react";
import { Box, Button, Card, CardBody, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ChallengeCardProps } from "~~/types/SportsbookTypes";

const ChallengeCard = ({
  challenge,
  challengeAccepted,
  challengeStarted,
  challengeResult,
  challengeCanceled,
  prizeWithdrawn,
  updateRefereeRequest,
  updateRefereeAccepted,
}: ChallengeCardProps) => {
  const [refereeAddress, setRefereeAddress] = useState(challenge.referee);
  const [updateRefereeAddress, setUpdateRefereeAddress] = useState<string>("");
  const [completeChallengeTeam1Score, setCompleteChallengeTeam1Score] = useState<string>("");
  const [completeChallengeTeam2Score, setCompleteChallengeTeam2Score] = useState<string>("");

  const { address } = useAccount();
  const currentChallengeId = challenge.challengeId.toString()
    ? BigNumber.from(challenge.challengeId.toString())
    : BigNumber.from(0);

  const team1PrizeClaimed = prizeWithdrawn?.some(
    event => event.challengeId === challenge.challengeId && event.team === challenge.team1,
  );
  const team2PrizeClaimed = prizeWithdrawn?.some(
    event => event.challengeId === challenge.challengeId && event.team === challenge.team2,
  );

  const isTeam1 = address === challenge.team1;
  const isTeam2 = address === challenge.team2;
  // const isReferee = address === refereeAddress;

  const userTeamWon =
    (challengeResult && isTeam1 && challengeResult.team1Result > challengeResult.team2Result) ||
    (challengeResult && isTeam2 && challengeResult.team1Result < challengeResult.team2Result);
  const userTeamTied =
    (challengeResult && isTeam1 && challengeResult.team1Result == challengeResult.team2Result) ||
    (challengeResult && isTeam2 && challengeResult.team1Result == challengeResult.team2Result);

  const { writeAsync: acceptChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "acceptChallenge",
    args: [currentChallengeId],
    value: challenge.bet ? ethers.utils.formatEther(challenge.bet.toString()) : undefined,
  });

  const { writeAsync: deleteChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "deleteChallenge",
    args: [currentChallengeId],
  });

  const { writeAsync: startChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "startChallenge",
    args: [currentChallengeId],
  });

  const { writeAsync: completeChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "completeChallenge",
    args: [
      currentChallengeId,
      completeChallengeTeam1Score ? parseInt(completeChallengeTeam1Score) : undefined,
      completeChallengeTeam2Score ? parseInt(completeChallengeTeam2Score) : undefined,
    ],
  });

  const { writeAsync: withdrawPrize } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "withdrawPrize",
    args: [currentChallengeId],
  });

  const { writeAsync: updateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "updateReferee",
    args: [currentChallengeId, updateRefereeAddress],
  });

  const { writeAsync: answerYesToUpdateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "answerUpdateReferee",
    args: [currentChallengeId, true],
  });

  const { writeAsync: answerNoToUpdateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "answerUpdateReferee",
    args: [currentChallengeId, false],
  });

  useEffect(() => {
    if (updateRefereeAccepted) {
      setRefereeAddress(updateRefereeAccepted.newReferee);
    } else {
      setRefereeAddress(challenge.referee);
    }
  }, [updateRefereeAccepted, challenge.referee]);

  return (
    <div key={challenge.challengeId}>
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
            <Heading size={"md"}>Challenge #{challenge.challengeId}</Heading>

            {challengeResult && (
              <>
                {challengeResult.team1Result > challengeResult.team2Result ? (
                  <>
                    <Text fontWeight={"bold"} fontSize={"xl"} marginBottom={0}>
                      Team 1 won!
                    </Text>
                    <Text fontSize={"md"} marginTop={0} marginBottom={0}>
                      The {parseFloat(ethers.utils.formatEther((challenge.bet * 2).toString())).toFixed(4)} ETH prize is{" "}
                      {userTeamWon ? "yours!" : "theirs!"}
                    </Text>
                  </>
                ) : challengeResult.team1Result < challengeResult.team2Result ? (
                  <>
                    <Text fontWeight={"bold"} fontSize={"xl"} marginBottom={0}>
                      Team 2 won!
                    </Text>
                    <Text fontSize={"md"} marginTop={0} marginBottom={0}>
                      The {parseFloat(ethers.utils.formatEther((challenge.bet * 2).toString())).toFixed(4)} ETH prize is
                      {userTeamWon ? "yours!" : "theirs!"}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text fontWeight={"bold"} fontSize={"xl"} marginBottom={0}>
                      It&apos;s a tie!
                    </Text>
                    <Text fontSize={"md"} marginTop={0} marginBottom={0}>
                      {parseFloat(ethers.utils.formatEther(challenge.bet.toString())).toFixed(4)} ETH can be claimed
                      back by each team.
                    </Text>
                  </>
                )}

                <Flex justifyContent={"space-around"} marginTop={0}>
                  <Box className="flex items-center justify-center space-x-2" margin={0}>
                    <Address address={challenge.team1} />
                    <Text> scored: {challengeResult.team1Result}</Text>
                  </Box>
                  <Box className="flex items-center justify-center space-x-2" margin={0}>
                    <Address address={challenge.team2} />
                    <Text> scored: {challengeResult.team2Result}</Text>
                  </Box>
                </Flex>
              </>
            )}

            {challengeCanceled && (
              <Box className="flex items-center justify-center space-x-2" margin={0}>
                <Text>Match was canceled by </Text>
                <Address address={challengeCanceled.canceledBy} />
              </Box>
            )}

            {!challengeResult && !challengeCanceled && (
              <>
                <Box className="flex items-center justify-center space-x-2" margin={0}>
                  <Address address={challenge.team1} />
                  <p>has challenged</p>
                  <Address address={challenge.team2} />
                </Box>
                <Text margin={0}>
                  to a $SPORT match{" "}
                  <strong>
                    betting{" "}
                    {challenge.bet.toString()
                      ? parseFloat(ethers.utils.formatEther(challenge.bet.toString())).toFixed(4)
                      : 0}{" "}
                    ETH each
                  </strong>
                </Text>

                <Box className="flex items-center justify-center space-x-2">
                  <Address address={refereeAddress} />
                  <p>{challengeStarted ? <>is</> : <>will be</>} the referee for the match</p>
                </Box>
              </>
            )}

            {/* DYNAMIC BUTTONS! */}

            <>
              <Flex justifyContent={"space-around"} marginBottom={0}>
                {address == challenge.team2 && !challengeAccepted && !challengeCanceled && (
                  <Button onClick={() => acceptChallenge()} backgroundColor={"green"} textColor={"white"}>
                    Accept challenge <br />
                    (Bet{" "}
                    {challenge.bet.toString()
                      ? parseFloat(ethers.utils.formatEther(challenge.bet.toString())).toFixed(4)
                      : 0}{" "}
                    ETH)
                  </Button>
                )}
                {address == refereeAddress && challengeAccepted && !challengeStarted && !challengeCanceled && (
                  <Button onClick={() => startChallenge()} backgroundColor={"blue"} textColor={"white"}>
                    Start challenge
                  </Button>
                )}
                {(address == challenge.team1 || address == challenge.team2 || address == challenge.referee) &&
                  !challengeStarted &&
                  !challengeCanceled && (
                    <Button onClick={() => deleteChallenge()} backgroundColor={"red"} textColor={"white"}>
                      Delete and refund
                    </Button>
                  )}{" "}
                {/* Button to withdraw prize */}
                {challengeResult && (
                  <>
                    {/* Team1 won or tied */}
                    {isTeam1 && (userTeamWon || userTeamTied) && !team1PrizeClaimed && (
                      <Button
                        onClick={() => withdrawPrize()}
                        backgroundColor={"green"}
                        textColor={"white"}
                        isDisabled={team1PrizeClaimed}
                      >
                        Withdraw Prize
                      </Button>
                    )}
                    {/* Team2 won or tied */}
                    {isTeam2 && (userTeamWon || userTeamTied) && !team2PrizeClaimed && (
                      <Button
                        onClick={() => withdrawPrize()}
                        backgroundColor={"green"}
                        textColor={"white"}
                        isDisabled={team2PrizeClaimed}
                      >
                        Withdraw Prize
                      </Button>
                    )}
                    {/* Won and already withdrawn*/}
                    {challengeResult.team1Result != challengeResult.team2Result &&
                      (team1PrizeClaimed || team2PrizeClaimed) && (
                        <Button isDisabled backgroundColor={"gray"} textColor={"white"}>
                          Prize Withdrawn
                        </Button>
                      )}
                    {/* Tied and already withdrawn */}
                    {challengeResult.team1Result == challengeResult.team2Result &&
                      ((isTeam1 && team1PrizeClaimed) || (isTeam2 && team2PrizeClaimed)) && (
                        <Button isDisabled backgroundColor={"gray"} textColor={"white"}>
                          Prize Withdrawn
                        </Button>
                      )}
                  </>
                )}
              </Flex>
              {address == refereeAddress && challengeStarted && !challengeResult && !challengeCanceled && (
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

            {/* Update referee and about this match */}
            <Accordion marginTop={4} backgroundColor={"orange.700"} textColor={"white"}>
              {(address == challenge.team1 || address == challenge.team2) &&
                !challengeStarted &&
                !challengeCanceled && (
                  <AccordionItem>
                    <h2>
                      <AccordionButton backgroundColor={updateRefereeRequest ? "blue.600" : "orange.800"}>
                        <Box as="span" flex="1" textAlign="left">
                          Update referee
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    {!updateRefereeRequest && (
                      <AccordionPanel pb={4}>
                        Don&apos;t like the current referee? Propose a new one!
                        <Flex justifyContent={"space-around"} marginTop={4}>
                          <>
                            <AddressInput
                              placeholder="Enter address for new referee"
                              value={updateRefereeAddress}
                              onChange={newValue => {
                                setUpdateRefereeAddress(newValue.toString());
                              }}
                            />
                            <Button onClick={updateReferee} backgroundColor={"blue.600"} textColor={"white"}>
                              Propose new referee
                            </Button>
                          </>
                        </Flex>
                      </AccordionPanel>
                    )}
                    {updateRefereeRequest && (
                      <AccordionPanel pb={4}>
                        <Box className="flex items-center justify-center space-x-2" margin={0}>
                          <Address address={updateRefereeRequest?.proposingTeam} />
                          <p>has proposed</p>
                          <Address address={updateRefereeRequest?.newReferee} />
                          <p>as a new referee</p>
                        </Box>
                        {updateRefereeRequest?.proposingTeam != address && (
                          <Flex justifyContent={"space-around"}>
                            <Button
                              onClick={() => {
                                answerYesToUpdateReferee();
                              }}
                              backgroundColor={"green.500"}
                              textColor={"white"}
                            >
                              Accept new referee
                            </Button>
                            <Button
                              onClick={() => {
                                answerNoToUpdateReferee();
                              }}
                              backgroundColor={"red.500"}
                              textColor={"white"}
                            >
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
                <AccordionPanel pb={4} pt={0}>
                  {challengeResult ? (
                    <>
                      <Box marginTop={0} className="flex items-center justify-center space-x-2" margin={0}>
                        <Address address={challenge.team2} />
                        <p>was challenged by</p>
                        <Address address={challenge.team1} />
                      </Box>
                      <Text margin={0}>
                        to a $SPORT match{" "}
                        <strong>
                          betting{" "}
                          {challenge.bet.toString()
                            ? parseFloat(ethers.utils.formatEther(challenge.bet.toString())).toFixed(4)
                            : 0}{" "}
                          ETH each
                        </strong>
                      </Text>

                      {!challengeCanceled && (
                        <Box className="flex items-center justify-center space-x-2">
                          <Address address={refereeAddress} />
                          <p>was the referee and set the score</p>
                        </Box>
                      )}
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

export default ChallengeCard;
