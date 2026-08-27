// Phase 2/4 — mutations added as phases progress.

export const REGISTER_MUTATION = /* GraphQL */ `
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
        createdAt
      }
    }
  }
`;

export const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        createdAt
      }
    }
  }
`;

export const SAVE_GAME_RESULT_MUTATION = /* GraphQL */ `
  mutation SaveGameResult(
    $totalTimeMs: Int!
    $correctCount: Int!
    $wrongAttempts: Int!
    $penaltyMs: Int!
  ) {
    saveGameResult(
      totalTimeMs: $totalTimeMs
      correctCount: $correctCount
      wrongAttempts: $wrongAttempts
      penaltyMs: $penaltyMs
    ) {
      id
      totalTimeMs
      penaltyMs
      createdAt
    }
  }
`;
