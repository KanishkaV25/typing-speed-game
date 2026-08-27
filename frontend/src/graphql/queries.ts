// Phase 0 — hello ping query
// More queries added in Phase 4/5.

export const HELLO_QUERY = /* GraphQL */ `
  query Hello {
    hello
  }
`;

export const ME_QUERY = /* GraphQL */ `
  query Me {
    me {
      id
      email
      createdAt
    }
  }
`;

export const MY_GAME_HISTORY_QUERY = /* GraphQL */ `
  query MyGameHistory {
    myGameHistory {
      id
      totalTimeMs
      correctCount
      wrongAttempts
      penaltyMs
      createdAt
    }
  }
`;

export const MY_BEST_SCORE_QUERY = /* GraphQL */ `
  query MyBestScore {
    myBestScore {
      id
      totalTimeMs
      penaltyMs
      createdAt
    }
  }
`;

export const LEADERBOARD_QUERY = /* GraphQL */ `
  query Leaderboard($limit: Int) {
    leaderboard(limit: $limit) {
      userId
      email
      bestTimeMs
      gamesPlayed
    }
  }
`;
