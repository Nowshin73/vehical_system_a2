"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const createBooking = async (req, res) => {
    try {
        const user = req.user;
        const result = await booking_service_1.bookingService.createBooking(req.body, user);
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const getBookings = async (req, res) => {
    try {
        const user = req.user;
        const result = await booking_service_1.bookingService.getBookings(user);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const user = req.user;
        const bookingId = req.params.bookingId;
        const result = await booking_service_1.bookingService.updateBooking(bookingId, user);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data ?? null,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.bookingController = {
    createBooking,
    getBookings,
    updateBooking
};
