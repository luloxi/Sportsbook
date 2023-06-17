import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import {
  Button,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import sportsbookBase from "../constants/SportsbookBase.json";

const DeclineChallenge = () => {
  const [challengeId, setChallengeId] = useState("");
  const onChangeChallengeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeId(event.target.value);
  };

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: sportsbookBase.abi,
    functionName: "deleteChallenge",
    args: [
      challengeId,

      // BigNumber.from(uint256 variable),
      // {
      //   value: ethers.utils.parseEther((0.02 * mintAmount).toString()),
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
        <Heading as="h3" size="md" py={2}>
          Cancel existing challenge
        </Heading>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl>
          <FormLabel>Challenge ID:</FormLabel>
          <Input
            value={challengeId}
            onChange={onChangeChallengeId}
            type="number"
            placeholder="Enter challenge ID"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2} marginY={3}>
        <Button
          size="lg"
          w="full"
          colorScheme="red"
          // disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Canceling..." : "Cancel"}
        </Button>
      </GridItem>
    </>
  );
};

export default DeclineChallenge;
