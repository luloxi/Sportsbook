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
  Text,
} from "@chakra-ui/react";
import abi from "../constants/abi.json";
import ReadIsStarted from "./ReadIsStarted";

const StartChallenge = () => {
  const [challengeId, setChallengeId] = useState("");
  const onChangeChallengeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeId(event.target.value);
  };

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "startChallenge",
    args: [
      challengeId,

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
      <GridItem colSpan={2}>
        <Heading as="h3" size="md">
          Set a challenge as started
        </Heading>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>
            Challenge ID: <ReadIsStarted challengeId={challengeId} />
          </FormLabel>
          <Input
            value={challengeId}
            onChange={onChangeChallengeId}
            type="text"
            placeholder="Enter challenge ID"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}></GridItem>

      {/* <ReadIsStarted /> */}

      <GridItem colSpan={2} marginY={3}>
        <Button
          size="lg"
          w="full"
          colorScheme="orange"
          // disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Starting..." : "Start!"}
        </Button>
      </GridItem>
    </>
  );
};

export default StartChallenge;
