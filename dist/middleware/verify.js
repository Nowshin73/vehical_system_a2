"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verify = (req, res, next) => {
    const ID = true;
    if (!ID) {
        throw new Error("Not Allowed");
    }
    next();
};
exports.default = verify;
