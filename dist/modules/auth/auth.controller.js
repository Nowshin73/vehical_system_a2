"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const createUser = async (req, res) => {
    try {
        const result = await auth_service_1.authServices.createUser(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await auth_service_1.authServices.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.authController = {
    loginUser,
    createUser
};
