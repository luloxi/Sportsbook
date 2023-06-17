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
  FormControl,
  FormLabel,
  Input,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import sportsbookBase from "../constants/SportsbookBase.json";

const UpdateLocationProvider = () => {
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const [updateChallengeId, setUpdateChallengeId] = useState("");
  const onChangeUpdateChallengeId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateChallengeId(event.target.value);
  };

  const [updateLocationProvider, setLocationProvider] = useState("");
  const onChangeUpdateLocationProvider = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocationProvider(event.target.value);
  };

  const { address } = useAccount();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: sportsbookBase.abi,
    functionName: "updateLocationProvider",
    args: [
      updateChallengeId,
      updateLocationProvider,

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
          Update location provider
        </Heading>
      </GridItem>

      <GridItem colSpan={colSpan} mb={2}>
        <FormControl>
          <FormLabel>Challenge ID:</FormLabel>
          <Input
            value={updateChallengeId}
            onChange={onChangeUpdateChallengeId}
            type="text"
            placeholder="Enter challenge ID"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={colSpan}>
        <FormControl>
          <FormLabel>New location provider:</FormLabel>
          <Input
            value={updateLocationProvider}
            onChange={onChangeUpdateLocationProvider}
            type="text"
            placeholder="Address of location provider"
          ></Input>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2} marginY={3}>
        <Button
          size="lg"
          w="full"
          colorScheme="blue"
          // disabled={!write || isLoading}
          onClick={() => write?.()}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </GridItem>
    </>
  );
};

export default UpdateLocationProvider;
