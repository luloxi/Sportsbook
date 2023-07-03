// import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import CreateChallengeBox from "../pages/sportsbook/CreateChallengeBox";
import ChallengeCard from "./sportsbook/ChallengeCard";
import { Card, CardBody, Flex, Heading, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import {
  ChallengeAcceptedProps,
  ChallengeCanceledProps,
  ChallengeCreatedProps,
  ChallengeResultProps,
  ChallengeStartedProps,
  UpdateRefereeAcceptedProps,
  UpdateRefereeRequestProps,
} from "~~/types/SportsbookTypes";

const Home: NextPage = () => {
  // State variables for challenge history
  const [challengeHistory, setChallengeHistory] = useState<ChallengeCreatedProps[]>([]);
  const [challengeAcceptedHistory, setChallengeAcceptedHistory] = useState<ChallengeAcceptedProps[]>([]);
  const [challengeStartedHistory, setChallengeStartedHistory] = useState<ChallengeStartedProps[]>([]);
  const [challengeResultHistory, setChallengeResultHistory] = useState<ChallengeResultProps[]>([]);
  const [challengeCanceledHistory, setChallengeCanceledHistory] = useState<ChallengeCanceledProps[]>([]);
  const [updateRefereeRequestHistory, setUpdateRefereeRequestHistory] = useState<UpdateRefereeRequestProps[]>([]);
  const [updateRefereeAcceptedHistory, setUpdateRefereeAcceptedHistory] = useState<UpdateRefereeAcceptedProps[]>([]);

  // Event history hooks
  const { data: ChallengeCreatedHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: ChallengeAcceptedHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeAccepted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: ChallengeStartedHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeStarted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: ChallengeResultHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: ChallengeCanceledHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: UpdateRefereeRequestHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeRequest",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  const { data: UpdateRefereeAccepted } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeAccepted",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  console.log("Testing events", updateRefereeRequestHistory);

  // Event subscription hooks
  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    listener: (challengeId, team1, team2, referee, bet) => {
      setChallengeHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: ChallengeCreatedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          referee,
          bet: parseInt(bet.toString()),
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeAccepted",
    listener: (challengeId, team1, team2) => {
      setChallengeAcceptedHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: ChallengeAcceptedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeStarted",
    listener: (challengeId, referee, team1, team2) => {
      setChallengeStartedHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: ChallengeStartedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          referee,
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
          team1Result,
          team2Result,
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
          canceledBy: canceledBy,
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeRequest",
    listener: (challengeId, proposingTeam, newReferee) => {
      setUpdateRefereeRequestHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: UpdateRefereeRequestProps = {
          challengeId: newChallengeId,
          proposingTeam,
          newReferee,
        };
        return [newChallenge, ...prev];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeAccepted",
    listener: (challengeId, newReferee) => {
      setUpdateRefereeAcceptedHistory(prev => {
        const newChallengeId = parseInt(challengeId.toString());
        if (prev.some(challenge => challenge.challengeId === newChallengeId)) {
          return prev;
        }

        const newChallenge: UpdateRefereeAcceptedProps = {
          challengeId: newChallengeId,
          newReferee,
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
        referee: event.args[3],
        bet: event.args[4].toString(),
      })) as ChallengeCreatedProps[];
      setChallengeHistory(mappedHistory);
    }
  }, [ChallengeCreatedHistory]);

  useEffect(() => {
    if (ChallengeAcceptedHistory) {
      const mappedHistory = ChallengeAcceptedHistory.map(event => ({
        challengeId: event.args[0].toString(),
        team1: event.args[1],
        team2: event.args[2],
        referee: event.args[3],
      })) as ChallengeAcceptedProps[];
      setChallengeAcceptedHistory(mappedHistory);
    }
  }, [ChallengeAcceptedHistory]);

  useEffect(() => {
    if (ChallengeStartedHistory) {
      const mappedHistory = ChallengeStartedHistory.map(event => ({
        challengeId: event.args[0].toString(),
        referee: event.args[1],
        team1: event.args[2],
        team2: event.args[3],
      })) as ChallengeStartedProps[];
      setChallengeStartedHistory(mappedHistory);
    }
  }, [ChallengeStartedHistory]);

  useEffect(() => {
    if (ChallengeResultHistory) {
      const mappedHistory = ChallengeResultHistory.map(event => ({
        challengeId: event.args[0].toString(),
        team1: event.args[1],
        team2: event.args[2],
        team1Result: event.args[3].toString(),
        team2Result: event.args[4].toString(),
      })) as ChallengeResultProps[];
      setChallengeResultHistory(mappedHistory);
    }
  }, [ChallengeResultHistory]);

  useEffect(() => {
    if (ChallengeCanceledHistory) {
      const mappedHistory = ChallengeCanceledHistory.map(event => ({
        challengeId: event.args[0].toString(),
        canceledBy: event.args[1],
      })) as ChallengeCanceledProps[];
      setChallengeCanceledHistory(mappedHistory);
    }
  }, [ChallengeCanceledHistory]);

  useEffect(() => {
    if (UpdateRefereeRequestHistory) {
      const mappedHistory = UpdateRefereeRequestHistory.map(event => ({
        challengeId: event.args[0].toString(),
        proposingTeam: event.args[1],
        newReferee: event.args[2],
      })) as UpdateRefereeRequestProps[];
      setUpdateRefereeRequestHistory(mappedHistory);
    }
  }, [UpdateRefereeRequestHistory]);

  useEffect(() => {
    if (UpdateRefereeAccepted) {
      const mappedHistory = UpdateRefereeAccepted.map(event => ({
        challengeId: event.args[0].toString(),
        newReferee: event.args[1],
      })) as UpdateRefereeAcceptedProps[];
      setUpdateRefereeAcceptedHistory(mappedHistory);
    }
  }, [UpdateRefereeAccepted]);

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
            filter: "brightness(0.5)",
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
                      const matchingChallengeAccepted = challengeAcceptedHistory.find(
                        result => result.challengeId === challenge.challengeId,
                      );
                      const matchingChallengeStarted = challengeStartedHistory.find(
                        result => result.challengeId === challenge.challengeId,
                      );
                      const matchingChallengeResult = challengeResultHistory.find(
                        result => result.challengeId === challenge.challengeId,
                      );
                      const matchingUpdateRefereeRequest = updateRefereeRequestHistory.find(
                        result => result.challengeId === challenge.challengeId,
                      );
                      const matchingUpdateRefereeAccepted = updateRefereeAcceptedHistory.find(
                        result => result.challengeId === challenge.challengeId,
                      );

                      return (
                        <ChallengeCard
                          key={challenge.challengeId}
                          challenge={challenge}
                          challengeAccepted={matchingChallengeAccepted ? matchingChallengeAccepted : undefined}
                          challengeStarted={matchingChallengeStarted ? matchingChallengeStarted : undefined}
                          challengeResult={matchingChallengeResult ? matchingChallengeResult : undefined}
                          challengeCanceled={matchingChallengeCanceled ? matchingChallengeCanceled : undefined}
                          updateRefereeRequest={matchingUpdateRefereeRequest ? matchingUpdateRefereeRequest : undefined}
                          updateRefereeAccepted={
                            matchingUpdateRefereeAccepted ? matchingUpdateRefereeAccepted : undefined
                          }
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
