import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import {
  Button,
  GridItem,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import sportsbookBase from "../constants/SportsbookBase.json";

const CreateChallenge = () => {
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const [locationProvider, setLocationProvider] = useState("");
  const onChangeLocationProvider = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocationProvider(event.target.value);
  };

  const [challengedTeam, setChallengedTeam] = useState("");
  const onChangeChallengedTeam = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChallengedTeam(event.target.value);
  };

  const { address } = useAccount();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: sportsbookBase.abi,
    functionName: "createChallenge",
    args: [
      challengedTeam,
      locationProvider,
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
      <GridItem colSpan={2}>
        <Heading as="h3" size="md">
          Challenge another team
        </Heading>
      </GridItem>

      <GridItem colSpan={2} mb={2}>
        <FormControl>
          <FormLabel>Team to challenge:</FormLabel>
          <Input
            value={challengedTeam}
            onChange={onChangeChallengedTeam}
            type="text"
            placeholder="Address of team to challenge"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={colSpan}>
        <FormControl>
          <FormLabel>Location provider:</FormLabel>
          <Input
            value={locationProvider}
            onChange={onChangeLocationProvider}
            type="text"
            placeholder="Enter wallet of location provider"
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}></GridItem>

      <GridItem colSpan={2} mt={2}>
        <Checkbox>Bet on this challenge</Checkbox>
        <Text>Location fee: 0.001 ETH</Text>
        <Text>
          Your cost: <strong>0.001 ETH</strong>
        </Text>
      </GridItem>

      <GridItem colSpan={2} marginTop={3}>
        <Button
          size="lg"
          w="full"
          colorScheme="purple"
          disabled={/*!write || */ isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Challenging..." : "Challenge!"}
        </Button>
      </GridItem>
    </>
  );
};

export default CreateChallenge;
