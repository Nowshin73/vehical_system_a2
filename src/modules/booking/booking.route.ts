import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";


const router = Router();

// Create booking (customer + admin)
router.post("/", auth("customer", "admin"), bookingController.createBooking);

// Get bookings (role-based)
router.get("/", auth("customer", "admin"), bookingController.getBookings);

// Update booking (cancel or return)
router.put("/:bookingId", auth("customer", "admin"), bookingController.updateBooking);





export const bookingRoute = router;
