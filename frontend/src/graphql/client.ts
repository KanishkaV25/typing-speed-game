/**
 * Minimal GraphQL client — no external dependency needed for Phase 0.
 * A proper client (e.g. urql) can be swapped in later without touching call sites.
 */
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql";

interface GQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

interface GQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function gqlClient<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const body: GQLRequest = { query, variables };
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json: GQLResponse<T> = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message);
  }

  if (json.data === undefined) {
    throw new Error("No data returned from server");
  }

  return json.data;
}
