import "reflect-metadata";
import db from "./config/db";
import { ApolloServer } from "@apollo/server";
import AdResolver from "./resolvers/adResolver";
import { buildSchema } from "type-graphql";
import TagsResolver from "./resolvers/tagResolver";
import CategoryResolver from "./resolvers/categoryResolver";
import UserResolver from "./resolvers/userResolver";
import { User } from "./entities/user";
import express from "express";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import Cookies from "cookies";
import { jwtVerify } from "jose";
import { customAuthChecker } from "./lib/authChecker";

export interface MyContext {
  req: express.Request;
  res: express.Response;
  user: User | null;
}

export interface Payload {
  email: string;
}

const app = express();
const httpServer = http.createServer(app);

async function main() {
  const schema = await buildSchema({
    resolvers: [TagsResolver, AdResolver, CategoryResolver, UserResolver],
    validate: false,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  app.use(
    "/",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user: User | null = null;

        const cookies = new Cookies(req, res);
        const token = cookies.get("token");
        if (token) {
          try {
            const verify = await jwtVerify<Payload>(
              token,
              new TextEncoder().encode(process.env.SECRET_KEY)
            );
            user = await User.findOneBy({ email: verify.payload.email });
          } catch (err) {
            console.log(err);
          }
        }
        return { req, res, user };
      },
    })
  );
  await db.initialize();
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4001 }, resolve)
  );
  console.log(`🚀 Server lancé sur http://localhost:4001/`);
}

main();
