import { useContractRead } from "wagmi";
import abi from "../constants/abi.json";

const ReadIsStarted = ({ challengeId }: { challengeId: any }) => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const {
    data,
    isError,
    isLoading,
  }: { data: any; isError: any; isLoading: any } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "isMatchStarted",
    args: [challengeId],
    // chainId: 31337,
    watch: true,
    cacheTime: 2_000,
  });

  return (
    <>
      <strong>{data ? <>STARTED!</> : <>Not started</>}</strong>
    </>
  );
};

export default ReadIsStarted;
