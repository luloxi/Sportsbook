import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import { Button } from "@chakra-ui/react";
import sportsbookBase from "../constants/SportsbookBase.json";

const AcceptChallenge = ({ challengeId }: { challengeId: any }) => {
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
    <Button
      size="lg"
      w="full"
      colorScheme="green"
      // disabled={!write || isLoading}
      onClick={() => write?.()}
    >
      {isLoading ? "Accepting..." : "Accept"}
    </Button>
  );
};

export default AcceptChallenge;
