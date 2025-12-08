"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = exports.loginUser = exports.secret = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../database/db");
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secret = config_1.default.jwt_secret;
const createUser = async (payload) => {
    const { name, email, password, phone, role } = payload;
    const hashPassword = await bcryptjs_1.default.hash(password, 12);
    const result = await db_1.pool.query(`
      INSERT INTO Users(name,email,password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
    `, [name, email, hashPassword, phone, role]);
    return result;
};
const loginUser = async (email, password) => {
    const result = await db_1.pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (result.rows.length === 0) {
        return "User not found!";
    }
    const user = result.rows[0];
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match)
        return "Invalid Credentials!";
    const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, exports.secret, { expiresIn: "7d" });
    console.log(token);
    // delete user.password;
    return { token, user };
};
exports.loginUser = loginUser;
exports.authServices = {
    loginUser: exports.loginUser,
    createUser
};
