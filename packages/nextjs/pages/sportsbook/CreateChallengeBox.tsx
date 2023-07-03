import React from "react";
import { useState } from "react";
import { Button, Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { AddressInput, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const CreateChallengeBox = ({}) => {
  const [createChallengeTeam2Address, setCreateChallengeTeam2Address] = useState<string | undefined>("");
  const [createChallengeRefereeAddress, setCreateChallengeRefereeAddress] = useState<string | undefined>("");
  const [createChallengeValue, setCreateChallengeValue] = useState<string>("");

  const { writeAsync: createChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "createChallenge",
    args: [createChallengeTeam2Address, createChallengeRefereeAddress],
    value: createChallengeValue ? createChallengeValue : undefined,
  });

  return (
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
            ⚔️ Who do you want to challenge? ⚔️
          </Text>
          <AddressInput
            placeholder="Enter address for team 2"
            onChange={setCreateChallengeTeam2Address}
            value={createChallengeTeam2Address ?? ""}
          />
          <br />
          <Text fontWeight={"bold"} marginBottom={0} marginTop={0}>
            🏁 Propose a referee 🏁
          </Text>
          <AddressInput
            placeholder="Enter address for referee"
            onChange={setCreateChallengeRefereeAddress}
            value={createChallengeRefereeAddress ?? ""}
          />
          <br />
          <Text fontWeight={"bold"} marginBottom={0} marginTop={0}>
            💰 (optional) Bet ETH on the match outcome 💰
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
          Your oponent will have to pay the same to accept
          <br />
          <Text fontWeight={"bold"} mt={0} mb={0}>
            Winner gets all, Tie gives back the ETH
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
  );
};

export default CreateChallengeBox;
