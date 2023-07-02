export type ChallengeCreatedProps = {
  challengeId: number;
  team1: string;
  team2: string;
  bet: number;
};

export type ChallengeResultProps = {
  challengeId: number;
  team1: string;
  team2: string;
  referee: string;
  team1Result: number;
  team2Result: number;
};

export type ChallengeCanceledProps = {
  challengeId: number;
  canceledBy: string;
};

export type MyChallengeCreatedProps = {
  challenge: ChallengeCreatedProps;
  challengeCanceled?: ChallengeCanceledProps; // Added the challengeCanceled prop
  challengeResult?: ChallengeResultProps; // Added the challengeResult prop
};
