import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import {
  Button,
  GridItem,
  Input,
  Heading,
  FormControl,
  FormLabel,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import AcceptChallenge from "./AcceptChallenge";
import DeclineChallenge from "./DeclineChallenge";
import ReadIsAccepted from "./ReadIsAccepted";
import sportsbookBase from "../constants/SportsbookBase.json";

const AcceptDecline = () => {
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const [challengeId, setChallengeId] = useState("");
  const onChangeChallengeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeId(event.target.value);
  };

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: sportsbookBase.abi,
    functionName: "acceptChallenge",
    args: [
      challengeId,

      // BigNumber.from(uint256 variable),
      {
        value: ethers.utils.parseEther((0.001).toString()),
      },
    ],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      {/* Accept/Decline section */}
      <GridItem colSpan={colSpan}>
        <GridItem colSpan={2}>
          <Heading as="h3" size="md">
            Respond to a challenge
          </Heading>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>
              Challenge ID: <ReadIsAccepted challengeId={challengeId} />
            </FormLabel>
            <Input
              value={challengeId}
              onChange={onChangeChallengeId}
              type="number"
              placeholder="Enter challenge ID"
            ></Input>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2} mt={2}>
          <Text>Bet amount: 0 ETH</Text>
          <Text>Location fee: 0.001 ETH</Text>
          <Text>
            Total cost: <strong>0.001 ETH</strong>
          </Text>
        </GridItem>

        <GridItem colSpan={1} marginY={3}>
          <AcceptChallenge challengeId={challengeId} />
        </GridItem>

        <GridItem colSpan={1}>
          <DeclineChallenge challengeId={challengeId} />
        </GridItem>
      </GridItem>
    </>
  );
};

export default AcceptDecline;
