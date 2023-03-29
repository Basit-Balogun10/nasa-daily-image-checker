"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = void 0;
const react_1 = require("react");
const UserContext = (0, react_1.createContext)({});
exports.UserProvider = UserContext.Provider;
exports.default = UserContext;
