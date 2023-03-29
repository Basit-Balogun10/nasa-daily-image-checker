"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayImage = void 0;
const axios_1 = __importDefault(require("axios"));
const getTodayImage = (req, res) => {
    axios_1.default
        .get(`https://api.nasa.gov/planetary/apod?api_key=Rb7gg4PDSDNrNrx7pIBh1SSBw9S5i2Da5x9dPOXC`)
        .then((response) => {
        console.log("resData", req.cookies["NDIC_token"], response.data);
        res.status(200).json(response.data);
    })
        .catch((err) => {
        throw new Error(err);
    });
};
exports.getTodayImage = getTodayImage;
