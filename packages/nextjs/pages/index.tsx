// import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import CreateChallengeBox from "../pages/sportsbook/CreateChallengeBox";
import ChallengeCard from "./sportsbook/ChallengeCard";
import { Card, CardBody, Flex, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import {
  ChallengeAcceptedProps,
  ChallengeCanceledProps,
  ChallengeCreatedProps,
  ChallengeResultProps,
  ChallengeStartedProps,
  UpdateRefereeRequestProps,
  UpdateRefereeResponseProps,
} from "~~/types/SportsbookTypes";

const Home: NextPage = () => {
  // State variables for challenge history
  const [challengeHistory, setChallengeHistory] = useState<ChallengeCreatedProps[]>([]);
  const [challengeAcceptedHistory, setChallengeAcceptedHistory] = useState<ChallengeAcceptedProps[]>([]);
  const [challengeStartedHistory, setChallengeStartedHistory] = useState<ChallengeStartedProps[]>([]);
  const [challengeResultHistory, setChallengeResultHistory] = useState<ChallengeResultProps[]>([]);
  const [challengeCanceledHistory, setChallengeCanceledHistory] = useState<ChallengeCanceledProps[]>([]);
  const [updateRefereeRequestHistory, setUpdateRefereeRequestHistory] = useState<UpdateRefereeRequestProps[]>([]);
  const [updateRefereeResponseHistory, setUpdateRefereeResponseHistory] = useState<UpdateRefereeResponseProps[]>([]);

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

  const { data: UpdateRefereeResponseHistory } = useScaffoldEventHistory({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeResponse",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: false,
  });

  // Event history hooks
  useEffect(() => {
    const mappedHistory = ChallengeCreatedHistory?.map(event => ({
      challengeId: event.args[0].toString(),
      team1: event.args[1],
      team2: event.args[2],
      referee: event.args[3],
      bet: event.args[4].toString(),
    })) as ChallengeCreatedProps[];
    setChallengeHistory(mappedHistory);
  }, [ChallengeCreatedHistory]);

  useEffect(() => {
    const mappedHistory = ChallengeAcceptedHistory?.map(event => ({
      challengeId: event.args[0].toString(),
      team1: event.args[1],
      team2: event.args[2],
      referee: event.args[3],
    })) as ChallengeAcceptedProps[];
    setChallengeAcceptedHistory(mappedHistory);
  }, [ChallengeAcceptedHistory]);

  useEffect(() => {
    const mappedHistory = ChallengeStartedHistory?.map(event => ({
      challengeId: event.args[0].toString(),
      referee: event.args[1],
      team1: event.args[2],
      team2: event.args[3],
    })) as ChallengeStartedProps[];
    setChallengeStartedHistory(mappedHistory);
  }, [ChallengeStartedHistory]);

  useEffect(() => {
    const mappedHistory = ChallengeResultHistory?.map(event => ({
      challengeId: event.args[0].toString(),
      team1: event.args[1],
      team2: event.args[2],
      team1Result: event.args[3].toString(),
      team2Result: event.args[4].toString(),
    })) as ChallengeResultProps[];
    setChallengeResultHistory(mappedHistory);
  }, [ChallengeResultHistory]);

  useEffect(() => {
    const mappedHistory = ChallengeCanceledHistory?.map(event => ({
      challengeId: event.args[0].toString(),
      canceledBy: event.args[1],
    })) as ChallengeCanceledProps[];
    setChallengeCanceledHistory(mappedHistory);
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
    if (UpdateRefereeResponseHistory) {
      const mappedHistory = UpdateRefereeResponseHistory.map(event => ({
        challengeId: event.args[0].toString(),
        newReferee: event.args[1],
        updateAccepted: event.args[2],
      })) as UpdateRefereeResponseProps[];
      setUpdateRefereeResponseHistory(mappedHistory);
    }
  }, [UpdateRefereeResponseHistory]);

  // Event subscription hooks
  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    listener: (challengeId, team1, team2, referee, bet) => {
      setChallengeHistory(indexedHistory => {
        const newChallengeCreated: ChallengeCreatedProps = {
          challengeId: parseInt(challengeId.toString()),
          team1,
          team2,
          referee,
          bet: parseInt(bet.toString()),
        };
        return [newChallengeCreated, ...indexedHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeAccepted",
    listener: (challengeId, team1, team2) => {
      setChallengeAcceptedHistory(indexedHistory => {
        const newChallengeAccepted: ChallengeAcceptedProps = {
          challengeId: parseInt(challengeId.toString()),
          team1,
          team2,
        };
        return [newChallengeAccepted, ...indexedHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeStarted",
    listener: (challengeId, referee, team1, team2) => {
      setChallengeStartedHistory(indexedHistory => {
        const newChallengeStarted: ChallengeStartedProps = {
          challengeId: parseInt(challengeId.toString()),
          team1,
          team2,
          referee,
        };
        return [newChallengeStarted, ...indexedHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    listener: (challengeId, team1, team2, team1Result, team2Result) => {
      setChallengeResultHistory(indexedHistory => {
        const newChallengeResult: ChallengeResultProps = {
          challengeId: parseInt(challengeId.toString()),
          team1,
          team2,
          team1Result,
          team2Result,
        };
        return [newChallengeResult, ...indexedHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    listener: (challengeId, canceledBy) => {
      setChallengeCanceledHistory(indexedHistory => {
        const newChallengeCanceled: ChallengeCanceledProps = {
          challengeId: parseInt(challengeId.toString()),
          canceledBy: canceledBy,
        };
        return [newChallengeCanceled, ...indexedHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeRequest",
    listener: (challengeId, proposingTeam, newReferee) => {
      setUpdateRefereeRequestHistory(indexedHistory => {
        const newUpdateRefereeRequest: UpdateRefereeRequestProps = {
          challengeId: parseInt(challengeId.toString()),
          proposingTeam,
          newReferee,
        };
        return [newUpdateRefereeRequest, ...indexedHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeResponse",
    listener: (challengeId, newReferee, updateAccepted) => {
      setUpdateRefereeResponseHistory(indexedHistory => {
        const newUpdateRefereeResponse: UpdateRefereeResponseProps = {
          challengeId: parseInt(challengeId.toString()),
          newReferee,
          updateAccepted,
        };
        return [newUpdateRefereeResponse, ...indexedHistory];
      });
    },
  });

  const challengeCards = challengeHistory?.map(challenge => {
    const challengeAccepted = challengeAcceptedHistory?.find(
      accepted => accepted.challengeId === challenge.challengeId,
    );
    const challengeStarted = challengeStartedHistory?.find(started => started.challengeId === challenge.challengeId);
    const challengeResult = challengeResultHistory?.find(result => result.challengeId === challenge.challengeId);
    const challengeCanceled = challengeCanceledHistory?.find(
      canceled => canceled.challengeId === challenge.challengeId,
    );
    const updateRefereeRequests = updateRefereeRequestHistory?.filter(
      request => request.challengeId.toString() === challenge.challengeId.toString(),
    );
    const updateRefereeResponses = updateRefereeResponseHistory?.filter(
      response => response.challengeId.toString() === challenge.challengeId.toString(),
    );

    const newestUpdateRequest = updateRefereeRequests
      .filter(request => request.challengeId.toString() === challenge.challengeId.toString())
      .reverse()
      .pop();

    const newestAcceptedResponse = updateRefereeResponses
      .filter(response => response.challengeId.toString() === challenge.challengeId.toString())
      .reverse()
      .pop();

    const eventToShow =
      updateRefereeRequests.filter(request => request.challengeId.toString() === challenge.challengeId.toString())
        .length > 0 &&
      updateRefereeResponses.filter(response => response.challengeId.toString() === challenge.challengeId.toString())
        .length > 0 &&
      updateRefereeRequests.filter(request => request.challengeId.toString() === challenge.challengeId.toString())
        .length ===
        updateRefereeResponses.filter(response => response.challengeId.toString() === challenge.challengeId.toString())
          .length
        ? {
            response: newestAcceptedResponse,
          }
        : {
            request: newestUpdateRequest,
            response: newestAcceptedResponse,
          };

    return {
      challenge,
      challengeAccepted,
      challengeStarted,
      challengeResult,
      challengeCanceled,
      updateRefereeEvent: eventToShow,
    };
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
              <CardBody>
                <Heading size="xl">🏀 See your active challenges! ⚽</Heading>
                <Flex direction="column" alignItems="center" justifyContent="center">
                  {challengeCards?.map(
                    ({
                      challenge,
                      challengeAccepted,
                      challengeStarted,
                      challengeResult,
                      challengeCanceled,
                      updateRefereeEvent,
                    }) => (
                      <ChallengeCard
                        key={challenge.challengeId}
                        challenge={challenge}
                        challengeAccepted={challengeAccepted}
                        challengeStarted={challengeStarted}
                        challengeResult={challengeResult}
                        challengeCanceled={challengeCanceled}
                        updateRefereeRequest={updateRefereeEvent?.request}
                        updateRefereeAccepted={updateRefereeEvent?.response}
                      />
                    ),
                  )}
                </Flex>
              </CardBody>
            </Card>
          </Flex>
        </>
      </div>
    </>
  );
};

export default Home;
