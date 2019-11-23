import {} from "./index";

module.exports = {
    newPhoto: {
        subscribe: (_parent, _args, { pubsub }) =>
            pubsub.asyncIterator("photo-added"),
    },
};
