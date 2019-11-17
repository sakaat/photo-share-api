import { authorizeWithGithub } from "../lib";
import { photos } from "./index";

module.exports = {
    postPhoto(_parent, args) {
        let id = photos.length + 1;
        const newPhoto = {
            id: id++,
            ...args.input,
            created: new Date(),
        };
        photos.push(newPhoto);
        return newPhoto;
    },

    async githubAuth(_parent, { code }, { db }) {
        const {
            message,
            access_token,
            avatar_url,
            login,
            name,
        } = await authorizeWithGithub({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
        });

        if (message) {
            throw new Error(message);
        }

        const latestUserInfo = {
            name,
            githubLogin: login,
            githubToken: access_token,
            avatar: avatar_url,
        };

        const {
            ops: [user],
        } = await db
            .collection("users")
            .replaceOne({ githubLogin: login }, latestUserInfo, {
                upsert: true,
            });

        return { user, token: access_token };
    },
};
