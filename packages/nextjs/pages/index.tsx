// import Link from "next/link";
import { useState } from "react";
// import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address, AddressInput, Balance, EtherInput } from "~~/components/scaffold-eth";
import {
  /* useAccountBalance, */
  useDeployedContractInfo, // useScaffoldContractRead,
  useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data: sportsbookInfo } = useDeployedContractInfo("Sportsbook");

  const [createChallengeTeam2Address, setCreateChallengeTeam2Address] = useState<string | undefined>("");
  const [createChallengeRefereeAddress, setCreateChallengeRefereeAddress] = useState<string | undefined>("");
  const [createChallengeValue, setCreateChallengeValue] = useState<string>("");

  // const { data: numberOne } = useScaffoldContractRead({
  //   contractName: "Sportsbook",
  //   functionName: "viewNumberOne",
  // });

  // const { writeAsync: setNumberOne } = useScaffoldContractWrite({
  //   contractName: "Sportsbook",
  //   functionName: "setNumberOne",
  //   args: [newNumber ? BigNumber.from(newNumber) : undefined],
  // });

  const { writeAsync: createChallenge } = useScaffoldContractWrite({
    contractName: "Sportsbook",
    functionName: "createChallenge",
    args: [createChallengeTeam2Address, createChallengeRefereeAddress],
    value: createChallengeValue ? createChallengeValue : undefined,
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 text-center mb-8">
        <div className="px-5">
          <div className="flex flex-col items-center justify-center w-full flex-grow">
            <h2 className="mt-2">Current user</h2>
            <Address address={address} />
            <Balance address={address} />
            <h2>Sportsbook contract</h2>
            <Address address={sportsbookInfo?.address} />
            <Balance address={sportsbookInfo?.address} />
            <h2 className="mt-2 font-bold">Create challenge</h2>
            <AddressInput
              placeholder="Enter address for team 2"
              onChange={setCreateChallengeTeam2Address}
              value={createChallengeTeam2Address ?? ""}
            />
            <AddressInput
              placeholder="Enter address for referee"
              onChange={setCreateChallengeRefereeAddress}
              value={createChallengeRefereeAddress ?? ""}
            />
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
            <button className="btn btn-primary" onClick={createChallenge}>
              Create challenge
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
