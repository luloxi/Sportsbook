// import Link from "next/link";
// import { useAccount } from "wagmi";
// import { BigNumber } from "ethers";
import { useState } from "react";
import { useEffect } from "react";
import CreateChallengeBox from "../pages/sportsbook/CreateChallengeBox";
import ShowChallengeCreated from "../pages/sportsbook/ShowChallengeCreated";
import { Card, CardBody, Flex, Heading, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { ChallengeCreatedProps } from "~~/types/SportsbookTypes";

const Home: NextPage = () => {
  // const { address } = useAccount();
  // const { data: sportsbookInfo } = useDeployedContractInfo("Sportsbook");

  const [challengeCreated, setChallengeCreated] = useState<ChallengeCreatedProps[]>([]);

  const { data: ChallengeCreated } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  useEffect(() => {
    setChallengeCreated(
      ChallengeCreated?.map(event => {
        return {
          challengeId: event.args[0].toString(),
          team1: event.args[1],
          team2: event.args[2],
          bet: event.args[3],
        } as ChallengeCreatedProps;
      }) as ChallengeCreatedProps[],
    );
  }, [ChallengeCreated]);

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    listener: (challengeId, team1, team2, bet) => {
      setChallengeCreated(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (!prev) prev = [];
        if (prev.some(e => e.challengeId === newChallengeId)) return prev;

        const newChallenge = {
          challengeId: newChallengeId,
          team1: team1,
          team2: team2,
          bet: parseInt(bet.toString()),
        } as ChallengeCreatedProps;
        return [newChallenge, ...prev];
      });
    },
  });

  return (
    <>
      <MetaHeader />

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('background.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "brightness(0.5)", // Adjust the brightness value as needed (0.5 = 50% brightness)
          }}
        />

        <>
          <Flex direction={{ base: "column", md: "row" }} justify="center" gap={10} align="center" marginTop={4}>
            <CreateChallengeBox />
            <Card
              direction={{ base: "column", sm: "row" }}
              width="container.sm"
              maxWidth={{ base: "container.sm", sm: "container.sm", md: "container.md" }}
              variant="solid"
              maxHeight={{ base: "container.sm", sm: "container.sm", md: "480" }}
              overflow={"auto"}
              textColor={"white"}
              backgroundColor={"orange.800"}
            >
              <Stack>
                <CardBody>
                  <Heading size="xl">🏀 See your active challenges! ⚽</Heading>
                  <Flex direction="column" alignItems="center" justifyContent="center">
                    {challengeCreated?.map((challenge, index) => (
                      <div key={index}>
                        <ShowChallengeCreated
                          challenge={challenge}
                          challengeId={index}
                          team1={challenge.team1}
                          team2={challenge.team2}
                          bet={challenge.bet}
                        />
                      </div>
                    ))}
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
          </Flex>
        </>
      </div>
    </>
  );
};

export default Home;
