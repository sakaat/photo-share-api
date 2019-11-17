import { photos } from "./index";

module.exports = {
    totalPhotos: () => photos.length,
    allPhotos: (_parent, args) => {
        if (args.after) {
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
