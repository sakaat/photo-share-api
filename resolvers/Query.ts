import {} from "./index";

module.exports = {
    totalUsers: (_parent, _args, { db }) =>
        db.collection("users").estimatedDocumentCount(),

    allUsers: (_parent, _args, { db }) =>
        db
            .collection("users")
            .find()
            .toArray(),

    totalPhotos: (_parent, _args, { db }) =>
        db.collection("photos").estimatedDocumentCount(),

    allPhotos: (_parent, args, { db }) => {
        const photos = db
            .collection("photos")
            .find()
            .toArray();
        if (args.after && photos.length > 0) {
            return photos.filter(
                (p) =>
                    new Date(p.created).getTime() >=
                    new Date(args.after).getTime(),
            );
        } else {
            return photos;
        }
    },
};
