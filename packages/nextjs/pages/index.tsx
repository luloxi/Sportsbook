// import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import CreateChallengeBox from "../pages/sportsbook/CreateChallengeBox";
import ShowChallengeCreated from "../pages/sportsbook/ShowChallengeCreated";
import { Card, CardBody, Flex, Heading, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { ChallengeCanceledProps, ChallengeCreatedProps, ChallengeResultProps } from "~~/types/SportsbookTypes";

const Home: NextPage = () => {
  // State variables for challenge history
  const [challengeHistory, setChallengeHistory] = useState<ChallengeCreatedProps[]>([]);
  const [challengeCanceledHistory, setChallengeCanceledHistory] = useState<ChallengeCanceledProps[]>([]);
  const [challengeResultHistory, setChallengeResultHistory] = useState<ChallengeResultProps[]>([]);

  // Event history hooks
  const { data: ChallengeCreatedHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: ChallengeCanceledHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: ChallengeResultHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  // Event subscription hooks
  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    listener: (challengeId, team1, team2, bet) => {
      setChallengeHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: ChallengeCreatedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          bet: parseInt(bet.toString()),
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    listener: (challengeId, canceledBy) => {
      setChallengeCanceledHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: ChallengeCanceledProps = {
          challengeId: newChallengeId,
          canceledBy: canceledBy.toString(),
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    listener: (challengeId, team1, team2, team1Result, team2Result) => {
      setChallengeResultHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: ChallengeResultProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          team1Result: parseInt(team1Result.toString()),
          team2Result: parseInt(team2Result.toString()),
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useEffect(() => {
    if (ChallengeCreatedHistory) {
      const mappedHistory = ChallengeCreatedHistory.map(event => ({
        challengeId: event.args[0].toString(),
        team1: event.args[1],
        team2: event.args[2],
        bet: event.args[3],
      })) as ChallengeCreatedProps[];
      setChallengeHistory(mappedHistory);
    }
  }, [ChallengeCreatedHistory]);

  useEffect(() => {
    if (ChallengeCanceledHistory) {
      const mappedHistory = ChallengeCanceledHistory.map(event => ({
        challengeId: event.args[0].toString(),
        canceledBy: event.args[1].toString(),
      })) as ChallengeCanceledProps[];
      setChallengeCanceledHistory(mappedHistory);
    }
  }, [ChallengeCanceledHistory]);

  useEffect(() => {
    if (ChallengeResultHistory) {
      const mappedHistory = ChallengeResultHistory.map(event => ({
        challengeId: event.args[0].toString(),
        team1: event.args[1],
        team2: event.args[2],
        team1Result: event.args[3],
        team2Result: event.args[4],
      })) as ChallengeResultProps[];
      setChallengeResultHistory(mappedHistory);
    }
  }, [ChallengeResultHistory]);

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
                    {challengeHistory?.map(challenge => {
                      const matchingChallengeCanceled = challengeCanceledHistory.find(
                        cancel => cancel.challengeId === challenge.challengeId,
                      );
                      const matchingChallengeResult = challengeResultHistory.find(
                        result => result.challengeId === challenge.challengeId,
                      );

                      return (
                        <ShowChallengeCreated
                          key={challenge.challengeId}
                          challenge={challenge}
                          challengeCanceled={matchingChallengeCanceled ? matchingChallengeCanceled : undefined}
                          challengeResult={matchingChallengeResult ? matchingChallengeResult : undefined}
                        />
                      );
                    })}
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
