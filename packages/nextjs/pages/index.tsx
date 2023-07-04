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
        properties: [
          {
            proposingTeam: event.args[1],
            newReferee: event.args[2],
          },
        ],
      }));
      setUpdateRefereeRequestHistory(mappedHistory);
    }
  }, [UpdateRefereeRequestHistory]);

  useEffect(() => {
    if (UpdateRefereeResponseHistory) {
      const mappedHistory = UpdateRefereeResponseHistory.map(event => ({
        challengeId: event.args[0].toString(),
        properties: [
          {
            newReferee: event.args[1],
            updateAccepted: event.args[2],
          },
        ],
      }));
      setUpdateRefereeResponseHistory(mappedHistory);
    }
  }, [UpdateRefereeResponseHistory]);

  // Event subscription hooks
  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCreated",
    listener: (challengeId, team1, team2, referee, bet) => {
      setChallengeHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());
        if (previousHistory.some(challenge => challenge.challengeId === newChallengeId)) {
          return previousHistory;
        }

        const newChallenge: ChallengeCreatedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          referee,
          bet: parseInt(bet.toString()),
        };
        return [newChallenge, ...previousHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeAccepted",
    listener: (challengeId, team1, team2) => {
      setChallengeAcceptedHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());
        if (previousHistory.some(challenge => challenge.challengeId === newChallengeId)) {
          return previousHistory;
        }

        const newChallenge: ChallengeAcceptedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
        };
        return [newChallenge, ...previousHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeStarted",
    listener: (challengeId, referee, team1, team2) => {
      setChallengeStartedHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());
        if (previousHistory.some(challenge => challenge.challengeId === newChallengeId)) {
          return previousHistory;
        }

        const newChallenge: ChallengeStartedProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          referee,
        };
        return [newChallenge, ...previousHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeResult",
    listener: (challengeId, team1, team2, team1Result, team2Result) => {
      setChallengeResultHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());
        if (previousHistory.some(challenge => challenge.challengeId === newChallengeId)) {
          return previousHistory;
        }

        const newChallenge: ChallengeResultProps = {
          challengeId: newChallengeId,
          team1,
          team2,
          team1Result,
          team2Result,
        };
        return [newChallenge, ...previousHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "ChallengeCanceled",
    listener: (challengeId, canceledBy) => {
      setChallengeCanceledHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());
        if (previousHistory.some(challenge => challenge.challengeId === newChallengeId)) {
          return previousHistory;
        }

        const newChallenge: ChallengeCanceledProps = {
          challengeId: newChallengeId,
          canceledBy: canceledBy,
        };
        return [newChallenge, ...previousHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeRequest",
    listener: (challengeId, proposingTeam, newReferee) => {
      setUpdateRefereeRequestHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());

        const newChallenge: UpdateRefereeRequestProps = {
          challengeId: newChallengeId,
          properties: [
            {
              proposingTeam,
              newReferee,
            },
          ],
        };

        return [newChallenge, ...previousHistory];
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "Sportsbook",
    eventName: "UpdateRefereeResponse",
    listener: (challengeId, newReferee, updateAccepted) => {
      setUpdateRefereeResponseHistory(previousHistory => {
        const newChallengeId = parseInt(challengeId.toString());

        const newChallenge: UpdateRefereeResponseProps = {
          challengeId: newChallengeId,
          properties: [
            {
              newReferee,
              updateAccepted,
            },
          ],
        };

        return [newChallenge, ...previousHistory];
      });
    },
  });

  const challengeCards = challengeHistory?.map(challenge => {
    const challengeCanceled = challengeCanceledHistory.find(canceled => canceled.challengeId === challenge.challengeId);
    const challengeAccepted = challengeAcceptedHistory.find(accepted => accepted.challengeId === challenge.challengeId);
    const challengeStarted = challengeStartedHistory.find(started => started.challengeId === challenge.challengeId);
    const challengeResult = challengeResultHistory.find(result => result.challengeId === challenge.challengeId);

    const updateRefereeRequests = updateRefereeRequestHistory.filter(
      request => request && request.challengeId.toString() === challenge.challengeId.toString(),
    );
    const updateRefereeResponses = updateRefereeResponseHistory.filter(
      response => response && response.challengeId.toString() === challenge.challengeId.toString(),
    );

    const newestRequest = updateRefereeRequests
      .filter(request => request.challengeId.toString() === challenge.challengeId.toString())
      .map(response => response.properties.find(event => event.newReferee))
      .reverse()
      .pop();

    const lastAcceptedResponse = updateRefereeResponses
      .filter(response => response.challengeId.toString() === challenge.challengeId.toString())
      .map(response => response.properties.find(event => event.updateAccepted))
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
            response: lastAcceptedResponse ? lastAcceptedResponse : undefined,
          }
        : {
            request: newestRequest ? newestRequest : undefined,
            response: lastAcceptedResponse ? lastAcceptedResponse : undefined,
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
                  {challengeCards.map(
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
