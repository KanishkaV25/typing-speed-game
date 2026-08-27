import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import { buildContext } from "./context";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  context: buildContext,
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  },
  graphqlEndpoint: "/graphql",
  maskedErrors: false,
});

const port = Number(process.env.PORT) || 4000;

const server = Bun.serve({
  port,
  fetch: yoga.fetch,
});

console.log(`🚀 GraphQL server connected & running at http://localhost:${server.port}/graphql`);




