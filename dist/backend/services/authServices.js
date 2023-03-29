"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const axios_1 = __importDefault(require("axios"));
class GoogleAuthService {
    static validateAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default
                .get(`${this.GOOGLE_ID_TOKEN_INFO_URL}?access_token=${accessToken}`)
                .then((res) => {
                if (res.status !== 200) {
                    throw new Error("id_token is invalid");
                }
                const audience = res.data["aud"];
                const googleClientId = process.env.GOOGLE_OAUTH2_CLIENT_ID || "687505628240-sverv8j1o0n9r14ci19ja6mvmrq9cuu4.apps.googleusercontent.com";
                if (audience !== googleClientId) {
                    throw new Error("Invalid audience");
                }
            })
                .catch((err) => {
                console.log("LINE 27", err, "LINE 27");
                throw new Error(err);
            });
        });
    }
    static getTokens(code, redirectUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const request_data = {
                code: code,
                client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID || "687505628240-sverv8j1o0n9r14ci19ja6mvmrq9cuu4.apps.googleusercontent.com",
                client_secret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET || "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",
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            };
            console.log(request_data);
            let accessToken = "";
            let refreshToken = "";
            console.log("IT'S IN HERE");
            yield axios_1.default
                .post(this.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, request_data)
                .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to obtain access token from Google");
                }
                console.log('TOKEN DATA', res.data);
                accessToken = res.data["access_token"];
                refreshToken = res.data["refresh_token"];
            })
                .catch((err) => {
                console.log('LINE 60', err);
                throw new Error(err);
            });
            console.log("ACCESS & REFRESH", accessToken, refreshToken);
            return { accessToken, refreshToken };
        });
    }
    static getUserInfo(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let userInfo = {};
            yield axios_1.default
                .get(`${this.GOOGLE_USER_INFO_URL}?access_token=${accessToken}`)
                .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to obtain user info from Google");
                }
                userInfo = res.data;
                console.log('USER INFO', userInfo, res.data);
            })
                .catch((err) => {
                throw new Error(err);
            });
            return userInfo;
        });
    }
}
GoogleAuthService.GOOGLE_ID_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";
GoogleAuthService.GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token";
GoogleAuthService.GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
exports.GoogleAuthService = GoogleAuthService;
