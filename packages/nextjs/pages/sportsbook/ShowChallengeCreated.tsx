import React from "react";
import { useState } from "react";
import { Box, Button, Card, CardBody, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { MyChallengeCreatedProps } from "~~/types/SportsbookTypes";

const ShowChallengeCreated = ({ challenge, challengeId, team1, team2, bet }: MyChallengeCreatedProps) => {
  const [updateRefereeAddress, setUpdateRefereeAddress] = useState<string>("");

  const { address } = useAccount();

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

  const { writeAsync: updateReferee } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "updateReferee",
    args: [challengeId ? BigNumber.from(challengeId) : BigNumber.from(0), updateRefereeAddress],
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
              <Address address={team1} />
              <p>has challenged</p>
              <Address address={team2} />
            </Box>
            <Text margin={0}>
              to a match{" "}
              <strong>
                betting {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0} ETH
              </strong>
            </Text>

            <Box className="flex items-center justify-center space-x-2">
              <Address address={team1} />
              <p>will be the referee for the match</p>
            </Box>
            {address == team2 && (
              <Button onClick={() => acceptChallenge()} backgroundColor={"green"} marginRight={4} textColor={"white"}>
                Accept challenge <br />
                (Bet {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0} ETH)
              </Button>
            )}
            {(address == team1 || address == team2) && (
              <Button onClick={() => deleteChallenge()} backgroundColor={"red"} textColor={"white"}>
                Delete and refund
              </Button>
            )}
            {/* Here comes the accordion! */}
            <Accordion marginTop={4} backgroundColor={"orange.700"} textColor={"white"}>
              <AccordionItem>
                <h2>
                  <AccordionButton backgroundColor={"blue.600"}>
                    <Box as="span" flex="1" textAlign="left">
                      Update referee
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Don&apos;t like the current referee? Propose a new one!
                  <Flex justifyContent={"space-around"} marginTop={4}>
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
                  </Flex>
                </AccordionPanel>
              </AccordionItem>

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
