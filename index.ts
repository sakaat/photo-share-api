import { ApolloServer } from "apollo-server-express";
import express = require("express");
import { readFileSync } from "fs";
import expressPlayground from "graphql-playground-middleware-express";

import { MongoClient } from "mongodb";
require("dotenv").config();

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
import { resolvers } from "./resolvers";

const start = async () => {
    const app = express();
    const MONGO_DB = process.env.DB_HOST;

    const client = await MongoClient.connect(MONGO_DB, {
        useNewUrlParser: true,
    });

    const db = client.db();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const githubToken = req.headers.authorization;
            const currentUser = await db
                .collection("users")
                .findOne({ githubToken });
            return { db, currentUser };
        },
    });

    server.applyMiddleware({ app });

    app.get("/", (_req, res) => res.end("Welcome to the PhotoShare API"));
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    app.listen({ port: 4000 }, () =>
        console.log(
            `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`,
        ),
    );
};

start();
