"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleController = void 0;
// import { userServices } from "./users.service";
const vehicle_service_1 = require("./vehicle.service");
const createVehicle = async (req, res) => {
    try {
        console.log("Received body:", req.body);
        const result = await vehicle_service_1.vehicleServices.createVehicle(req.body);
        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getAllVehicles = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.getAllVehicles();
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
};
const deleteVehicle = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.deleteVehicle(req.params.vehicleId);
        if (result === 2) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete: Active bookings found",
            });
        }
        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await vehicle_service_1.vehicleServices.updateVehicle(req.body, req.params.vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: vehicle,
        });
    }
    catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};
const getVehicleDetail = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.getVehicleDetail(req.params.vehicleId);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleDetail,
    deleteVehicle,
    updateVehicle
};
