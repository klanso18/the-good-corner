import { buildSchema } from "type-graphql";
import TagsResolver from "./resolvers/tagResolver";
import AdResolver from "./resolvers/adResolver";
import CategoryResolver from "./resolvers/categoryResolver";
import UserResolver from "./resolvers/userResolver";
import { customAuthChecker } from "./lib/authChecker";

export default buildSchema({
  resolvers: [TagsResolver, AdResolver, CategoryResolver, UserResolver],
  validate: false,
  authChecker: customAuthChecker,
});
