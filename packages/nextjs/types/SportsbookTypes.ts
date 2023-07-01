export type ChallengeCreatedProps = {
  challengeId: number;
  team1: string;
  team2: string;
  bet: number;
};

export type MyChallengeCreatedProps = ChallengeCreatedProps & {
  challenge: any;
};
