import { Maybe } from "type-graphql";
import db, { clearDB } from "./src/config/db";
import { ASTNode, GraphQLSchema, graphql, print } from "graphql";
import getSchema from "./src/schema";

export let schema: GraphQLSchema;

export async function execute(
  operation: ASTNode,
  variableValues?: Maybe<{
    readonly [variable: string]: unknown;
  }>,
  contextValue = {}
) {
  return await graphql({
    schema,
    source: print(operation),
    variableValues,
    contextValue,
  });
}

beforeAll(async () => {
  await db.initialize();
  schema = await getSchema;
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await db.destroy();
});
