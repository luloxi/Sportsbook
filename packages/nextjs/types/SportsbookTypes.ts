export type ChallengeCreatedProps = {
  challengeId: number;
  team1: string;
  team2: string;
  referee: string;
  bet: number;
};

export interface ChallengeAcceptedProps {
  challengeId: number;
  team1: string;
  team2: string;
}

export interface ChallengeStartedProps {
  challengeId: number;
  referee: string;
  team1: string;
  team2: string;
}

export type ChallengeResultProps = {
  challengeId: number;
  team1: string;
  team2: string;
  team1Result: number;
  team2Result: number;
};

export type ChallengeCanceledProps = {
  challengeId: number;
  canceledBy: string;
};

export type PrizeWithdrawnProps = {
  challengeId: number;
  team: string;
  amount: number;
};

export type UpdateRefereeRequestProps = {
  challengeId: number;
  proposingTeam: string;
  newReferee: string;
};

export type UpdateRefereeResponseProps = {
  challengeId: number;
  newReferee: string;
  updateAccepted: boolean;
};

export type ChallengeCardProps = {
  challenge: ChallengeCreatedProps;
  challengeAccepted?: ChallengeAcceptedProps;
  challengeStarted?: ChallengeStartedProps;
  challengeResult?: ChallengeResultProps;
  challengeCanceled?: ChallengeCanceledProps;
  prizeWithdrawn?: PrizeWithdrawnProps[];
  updateRefereeRequest?: UpdateRefereeRequestProps;
  updateRefereeAccepted?: UpdateRefereeResponseProps;
};
