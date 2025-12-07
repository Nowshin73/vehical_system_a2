import { Router } from "express";
import auth from "../../middleware/auth";
import { createBooking, updateBooking } from "./booking.controller";

export const bookingRoute = Router();

bookingRoute.post("/", auth("admin", "customer"), createBooking);
bookingRoute.put("/:bookingId", auth("admin", "customer"), updateBooking);
