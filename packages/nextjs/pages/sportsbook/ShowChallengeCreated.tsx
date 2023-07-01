import React from "react";
import { Box, Button, Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
// import { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { MyChallengeCreatedProps } from "~~/types/SportsbookTypes";

const ShowChallengeCreated = ({ challenge, challengeId, team1, team2, bet }: MyChallengeCreatedProps) => {
  console.log("ChallengeID", BigNumber.from(challengeId));
  const { address } = useAccount();

  const { writeAsync: acceptChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "acceptChallenge",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
    value: bet ? ethers.utils.formatEther(bet.toString()) : undefined,
  });

  const { writeAsync: deleteChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "deleteChallenge",
    args: [challenge.challengeId ? BigNumber.from(challenge.challengeId) : undefined],
  });

  return (
    <div key={challengeId}>
      <Card size={"md"} width={"xl"} backgroundColor={"orange.500"} marginTop={4} textAlign={"center"}>
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
              <Button onClick={() => acceptChallenge()} backgroundColor={"green"} marginRight={4}>
                Accept challenge
              </Button>
            )}

            <Button onClick={() => deleteChallenge()} backgroundColor={"red"}>
              Delete and refund
            </Button>
          </CardBody>
        </Stack>
      </Card>
    </div>
  );
};

export default ShowChallengeCreated;
