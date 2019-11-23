import fs = require("fs");
import fetch from "node-fetch";

const requestGithubToken = (credentials) =>
    fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(credentials),
    })
        .then((res) => res.json())
        .catch((error) => {
            throw new Error(JSON.stringify(error));
        });

const requestGithubUserAccount = (token) =>
    fetch(`https://api.github.com/user?access_token=${token}`)
        .then((res) => res.json())
        .catch((error) => {
            throw new Error(JSON.stringify(error));
        });

export async function authorizeWithGithub(credentials) {
    const { access_token } = await requestGithubToken(credentials);
    const githubUser = await requestGithubUserAccount(access_token);
    return { ...githubUser, access_token };
}

export async function uploadStream(stream, path) {
    // tslint:disable-next-line: no-unused-expression
    new Promise((resolve, reject) => {
        stream
            .on("error", (error) => {
                if (stream.truncated) {
                    fs.unlinkSync(path);
                }
                reject(error);
            })
            .on("end", resolve)
            .pipe(fs.createWriteStream(path));
    });
}
