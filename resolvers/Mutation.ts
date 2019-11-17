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
};
