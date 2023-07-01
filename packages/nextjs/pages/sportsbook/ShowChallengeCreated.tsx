import React from "react";
// import { useState } from "react";
import { Box, Button, Card, CardBody, CardFooter, Heading, Stack } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { MyChallengeCreatedProps } from "~~/types/SportsbookTypes";

const ShowChallengeCreated = ({ challenge, challengeId, team1, team2, bet }: MyChallengeCreatedProps) => {
  console.log("ChallengeID", BigNumber.from(challengeId));

  const { writeAsync: acceptChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "acceptChallenge",
    args: [challengeId ? BigNumber.from(challengeId) : undefined],
    value: bet ? ethers.utils.formatEther(bet.toString()) : undefined,
  });

  const { writeAsync: deleteChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "deleteChallenge",
    args: [challengeId ? BigNumber.from(challengeId) : undefined],
  });

  return (
    <div key={challengeId}>
      <Card size={"md"}>
        <Stack>
          <CardBody>
            <Heading size={"lg"}>Challenge ID: {challenge.challengeId}</Heading>
            <Box className="flex items-center justify-center">
              <Address address={team1} />
              <p>has challenged</p>
              <Address address={team2} />
            </Box>
            <Box className="flex items-center justify-center">
              <p>
                to a match, betting:{" "}
                {bet.toString() ? parseFloat(ethers.utils.formatEther(bet.toString())).toFixed(4) : 0} (in ETH)
              </p>
              <p></p>
            </Box>
            <Box className="flex items-center justify-center">
              <Address address={team1} />
              <p>was proposed as a referee for the match</p>
            </Box>
          </CardBody>
          <CardFooter>
            <Button onClick={() => acceptChallenge()} backgroundColor={"green"}>
              Accept
            </Button>
            <Button onClick={() => deleteChallenge()} backgroundColor={"red"}>
              Delete
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
};

export default ShowChallengeCreated;
