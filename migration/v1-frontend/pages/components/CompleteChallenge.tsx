import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import { useState } from "react";
import {
  Button,
  GridItem,
  Heading,
  FormControl,
  FormLabel,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import sportsbookBase from "../constants/SportsbookBase.json";
import ReadIsCompleted from "./ReadIsCompleted";

const CompleteChallenge = () => {
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const [challengeId, setChallengeId] = useState("");
  const onChangeChallengeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeId(event.target.value);
  };

  const [team1Result, setTeam1Result] = useState("");
  const onChangeTeam1Result = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam1Result(event.target.value);
  };

  const [team2Result, setTeam2Result] = useState("");
  const onChangeTeam2Result = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeam2Result(event.target.value);
  };

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: sportsbookBase.abi,
    functionName: "completeChallenge",
    args: [
      challengeId,
      team1Result,
      team2Result,

      // BigNumber.from(uint256 variable),
      // {
      //   value: ethers.utils.parseEther((0.001).toString()),
      // },
    ],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <GridItem colSpan={2} textAlign="center">
        <Heading as="h3" size="md">
          Set a challenge as completed
        </Heading>
      </GridItem>

      <GridItem colSpan={2} textAlign="center">
        <FormControl>
          <FormLabel>
            Challenge ID: <ReadIsCompleted challengeId={challengeId} />
          </FormLabel>
          <Input
            value={challengeId}
            onChange={onChangeChallengeId}
            type="text"
            placeholder="Enter challenge ID"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={colSpan}>
        <FormControl>
          <FormLabel>Team 1 result:</FormLabel>
          <Input
            value={team1Result}
            onChange={onChangeTeam1Result}
            type="text"
            placeholder="Enter team 1 result"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={colSpan}>
        <FormControl>
          <FormLabel>Team 2 result:</FormLabel>
          <Input
            value={team2Result}
            onChange={onChangeTeam2Result}
            type="text"
            placeholder="Enter team 2 result"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2} marginY={3}>
        <Button
          size="lg"
          w="full"
          colorScheme="orange"
          // disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Completing..." : "Complete!"}
        </Button>
      </GridItem>
    </>
  );
};

export default CompleteChallenge;
