import { GraphQLScalarType, Kind } from "graphql";
import { photos, tags, users } from "./index";

module.exports = {
    User: {
        postedPhotos: (parent) => {
            return photos.filter((p) => p.githubUser === parent.githubLogin);
        },
        inPhotos: (parent) =>
            tags
                .filter((tag) => tag.userID === parent.id)
                .map((tag) => tag.photoID)
                .map((photoID) => photos.find((p) => p.id === photoID)),
    },
    Photo: {
        url: (parent) => `https://yoursite.com/img/${parent.id}.jpg`,
        postedBy: (parent) => {
            return users.find((u) => u.githubLogin === parent.githubUser);
        },
        taggedUsers: (parent) =>
            tags
                .filter((tag) => tag.photoID === parent.id)
                .map((tag) => tag.userID)
                .map((userID) => users.find((u) => u.githubLogin === userID)),
    },
    DateTime: new GraphQLScalarType({
        name: "DateTime",
        description: "A valid date time value.",
        parseValue: (value) => new Date(value),
        serialize: (value) => new Date(value).toISOString(),
        parseLiteral: (ast) => {
            if (ast.kind === Kind.STRING) {
                return ast.value;
            }
        },
    }),
};
