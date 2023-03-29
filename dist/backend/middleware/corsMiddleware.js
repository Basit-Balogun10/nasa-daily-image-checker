"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsHandler = void 0;
const corsHandler = (err, req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
exports.corsHandler = corsHandler;
