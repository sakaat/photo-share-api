import { ApolloServer } from "apollo-server-express";
import express = require("express");
import { readFileSync } from "fs";
import expressPlayground from "graphql-playground-middleware-express";

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
import { resolvers } from "./resolvers";

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.applyMiddleware({ app });

app.get("/", (_req, res) => res.end("Welcome to the PhotoShare API"));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen({ port: 4000 }, () =>
    console.log(
        `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`,
    ),
);
