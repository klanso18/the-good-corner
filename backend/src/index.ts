import "reflect-metadata";
import db from "./config/db";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import AdResolver from "./resolvers/adResolver";
import { buildSchema } from "type-graphql";
import TagsResolver from "./resolvers/tagResolver";
import CategoryResolver from "./resolvers/categoryResolver";

const port = 4001;

buildSchema({
  resolvers: [TagsResolver, AdResolver, CategoryResolver],
}).then(async (schema) => {
  await db.initialize();
  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`graphql server listening on ${url}`);
});