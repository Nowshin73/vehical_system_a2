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
                data: result.rows,
            });
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
        const { role, ...restPayload } = req.body;
        if (loggedInUser.role === "customer" && loggedInUser.id !== targetUserId) {
            return res.status(403).json({
                success: false,
                message: "Customers can update only their own profile",
            });
        }
        if (loggedInUser.role === "customer" && role) {
            return res.status(403).json({
                success: false,
                message: "Customers cannot change role",
            });
        }
        const finalPayload = loggedInUser.role === "customer"
            ? restPayload
            : req.body;
        const result = await users_service_1.userServices.updateUser(finalPayload, targetUserId);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
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
