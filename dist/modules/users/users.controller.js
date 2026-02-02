"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const users_service_1 = require("./users.service");
const getAllUser = async (req, res) => {
    try {
        const result = await users_service_1.userServices.getAllUser();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const activeBookings = await users_service_1.userServices.checkActiveBookings(req.params.userId);
        if (activeBookings.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete user: User has active bookings"
            });
        }
        else {
            const result = await users_service_1.userServices.deleteUser(req.params.userId);
            if (result.rowCount === 0) {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                });
            }
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const targetUserId = req.params.userId;
        // 1️⃣ Get user from DB
        const result = await users_service_1.userServices.getUserById(targetUserId);
        // const targetUser = result?.rows?.[0];
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // 2️⃣ Customers can update ONLY their own profile
        if (loggedInUser.role === "customer" && loggedInUser.email !== result.email) {
            return res.status(403).json({
                success: false,
                message: "Customers can update only their own profile",
            });
        }
        // 3️⃣ Update based on role
        const updatedUser = await users_service_1.userServices.updateUser(req.body, targetUserId, loggedInUser.role);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const getSingleUser = async (req, res) => {
    try {
        // const email = req.user!.email
        const result = await users_service_1.userServices.getSingleUser(req.params.userId);
        return res.status(201).json({
            success: true,
            message: "User created",
            data: result.rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
};
exports.userController = {
    getAllUser,
    getSingleUser,
    deleteUser,
    updateUser,
};
