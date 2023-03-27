import axios from "axios";

export class GoogleAuthService {
    static GOOGLE_ID_TOKEN_INFO_URL =
        "https://www.googleapis.com/oauth2/v3/tokeninfo";
    static GOOGLE_ACCESS_TOKEN_OBTAIN_URL =
        "https://oauth2.googleapis.com/token";
    static GOOGLE_USER_INFO_URL =
        "https://www.googleapis.com/oauth2/v3/userinfo";

    static validateAccessToken(accessToken: string) {
        axios
            .get(`${this.GOOGLE_ID_TOKEN_INFO_URL}?access_token=${accessToken}`)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("id_token is invalid");
                }

                const audience = res.data["aud"];
                if (audience !== process.env.GOOGLE_OAUTH2_CLIENT_ID) {
                    throw new Error("Invalid audience");
                }
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    static getTokens(code: string, redirectUri: string) {
        const request_data = {
            code: code,
            client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        };

        let accessToken = "";
        let refreshToken = "";

        axios
            .post(this.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, request_data)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error(
                        "Failed to obtain access token from Google"
                    );
                }

                accessToken = res.data["access_token"];
                refreshToken = res.data["refresh_token"];
            })
            .catch((err) => {
                throw new Error(err);
            });

        return { accessToken, refreshToken };
    }

    static getUserInfo(accessToken: string) {
        let userInfo: Record<string, string> = {};

        axios
            .get(`${this.GOOGLE_ID_TOKEN_INFO_URL}?access_token=${accessToken}`)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to obtain user info from Google");
                }

                userInfo = res.data;
            })
            .catch((err) => {
                throw new Error(err);
            });

        return userInfo;
    }
}