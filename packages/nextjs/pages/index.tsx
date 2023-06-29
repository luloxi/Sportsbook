// import Link from "next/link";
// import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import {
  Address,
  Balance,
  /* IntegerInput */
} from "~~/components/scaffold-eth";
import {
  /* useAccountBalance, */
  useDeployedContractInfo,
  useScaffoldContractRead, // useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data: sportsbookInfo } = useDeployedContractInfo("Sportsbook");

  const { data: numberOne } = useScaffoldContractRead({
    contractName: "Sportsbook",
    functionName: "viewNumberOne",
  });

  // const [newNumber, setNewNumber] = useState("");

  // const { writeAsync: setNumberOne } = useScaffoldContractWrite({
  //   contractName: "Sportsbook",
  //   functionName: "setNumberOne",
  //   args: [newNumber],
  // });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Sportsbook</span>
            <div className="flex flex-col items-center justify-center w-full flex-grow">
              <h2 className="mt-2">Current user</h2>
              <Address address={address} />
              <Balance address={address} />
              <h2>Sportsbook contract</h2>
              <Address address={sportsbookInfo?.address} />
              <Balance address={sportsbookInfo?.address} />
              <div className="pt-10 font-black text-xl">
                <div>Number One: {numberOne?.toString()}</div>
              </div>
              <div className="p-10">
                {/* <IntegerInput
                  value={newNumber}
                  placeholder="Enter a number"
                  onChange={v => {
                    setNewNumber(v);
                  }}
                /> */}
                {/* <button className="btn btn-primary" onClick={setNumberOne}>
                  Set number one
                </button> */}
              </div>
            </div>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Home;
