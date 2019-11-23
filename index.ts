import { ApolloServer, PubSub } from "apollo-server-express";
import express = require("express");
import { readFileSync } from "fs";
import expressPlayground from "graphql-playground-middleware-express";
import { createServer } from "http";

import { MongoClient } from "mongodb";
require("dotenv").config();

import path = require("path");

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
import { resolvers } from "./resolvers";

const start = async () => {
    const app = express();
    app.use(
        "/img/photos",
        express.static(path.join(__dirname, "assets", "photos")),
    );

    const MONGO_DB = process.env.DB_HOST;

    const client = await MongoClient.connect(MONGO_DB, {
        useNewUrlParser: true,
    });

    const db = client.db();

    const pubsub = new PubSub();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req, connection }) => {
            const githubToken = req
                ? req.headers.authorization
                : connection.context.Authorization;
            const currentUser = await db
                .collection("users")
                .findOne({ githubToken });
            return { db, currentUser, pubsub };
        },
    });

    server.applyMiddleware({ app });

    app.get("/", (_req, res) => res.end("Welcome to the PhotoShare API"));
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);

    httpServer.listen({ port: 4000 }, () => {
        console.log(
            `GraphQL Server running at localhost:4000${server.graphqlPath}`,
        );
    });
};

start();
