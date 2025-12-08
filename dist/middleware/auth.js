"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const secret = config_1.default.jwt_secret;
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const header = req.headers.authorization;
            if (!header)
                return res.status(403).json({ message: "forbidden" });
            const token = header.split(" ")[1];
            if (!token)
                res.status(401).json({ message: "You are not allowed!" });
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            //const user = 
            // await pool.query(`SELECT * FROM users WHERE id=$1`, [
            //   decoded.id,
            // ]);
            //if (user.rows.length === 0) throw new Error("User not found");
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({ message: "unauthorized!!" });
            }
            next();
        }
        catch (e) {
            res.status(401).json({
                success: false,
                message: e.message,
            });
        }
    };
};
exports.default = auth;
