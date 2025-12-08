"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./database/db");
const config_1 = __importDefault(require("./config"));
const users_route_1 = require("./modules/users/users.route");
const auth_route_1 = require("./modules/auth/auth.route");
const vehicle_route_1 = require("./modules/vehicle/vehicle.route");
const booking_route_1 = require("./modules/booking/booking.route");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.use(express.urlencoded({ extended: true }));
const port = config_1.default.port;
(0, db_1.initDB)();
app.use("/api/v1/auth", auth_route_1.authRoute);
app.use("/api/v1/users", users_route_1.userRoute);
app.use("/api/v1/vehicles", vehicle_route_1.vehicleRoute);
app.use("/api/v1/bookings", booking_route_1.bookingRoute);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "This is the root route",
        path: req.path,
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
