"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const booking_controller_1 = require("./booking.controller");
const router = (0, express_1.Router)();
// Create booking (customer + admin)
router.post("/", (0, auth_1.default)("customer", "admin"), booking_controller_1.bookingController.createBooking);
// Get bookings (role-based)
router.get("/", (0, auth_1.default)("customer", "admin"), booking_controller_1.bookingController.getBookings);
// Update booking (cancel or return)
router.put("/:bookingId", (0, auth_1.default)("customer", "admin"), booking_controller_1.bookingController.updateBooking);
exports.bookingRoute = router;
