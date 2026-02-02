"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const db_1 = require("../../database/db");
const createBooking = async (payload, user) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("All fields are required!");
    }
    const userId = await db_1.pool.query(`SELECT id FROM Users WHERE email=$1`, [user.email]);
    console.log(userId);
    if (user.role === "customer" && userId.rows[0].id !== customer_id) {
        throw new Error("Customer can't book for another customer");
    }
    // if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    //   throw new Error("End date must be after start date");
    // }
    const vehicle = await db_1.pool.query(`SELECT * FROM Vehicles WHERE id = $1 AND availability_status = 'available'`, [vehicle_id]);
    const { vehicle_name, daily_rent_price } = vehicle.rows[0];
    if (vehicle.rows.length === 0) {
        throw new Error("Vehicle is not available for booking");
    }
    const dailyPrice = Number(vehicle.rows[0].daily_rent_price);
    const days = (new Date(rent_end_date).getTime() -
        new Date(rent_start_date).getTime()) /
        (1000 * 60 * 60 * 24);
    const total_price = dailyPrice * days;
    const status = 'active';
    const booking = await db_1.pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, $6)
     RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);
    await db_1.pool.query(`UPDATE Vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);
    return {
        ...booking.rows[0],
        vehicle: {
            vehicle_name,
            daily_rent_price
        }
    };
};
const getBookings = async (user) => {
    // ADMIN VIEW
    if (user.role === "admin") {
        const result = await db_1.pool.query(`SELECT 
         b.*,
         u.name AS customer_name,
         u.email AS customer_email,
         v.vehicle_name,
         v.registration_number,
         v.daily_rent_price
       FROM Bookings b
       JOIN Users u ON b.customer_id = u.id
       JOIN Vehicles v ON b.vehicle_id = v.id
       ORDER BY b.id DESC`);
        // return result.rows
        return result.rows.map((row) => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
                name: row.customer_name,
                email: row.customer_email,
            },
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
            }
        }));
    }
    // CUSTOMER VIEW
    const customer = await db_1.pool.query(`SELECT id FROM Users WHERE email = $1`, [user.email]);
    const customerId = customer.rows[0].id;
    const result = await db_1.pool.query(`SELECT 
        b.*,
        v.vehicle_name,
        v.registration_number,
        v.daily_rent_price,
        v.type
     FROM Bookings b
     JOIN Vehicles v ON b.vehicle_id = v.id
     WHERE b.customer_id = $1
     ORDER BY b.id DESC`, [customerId]);
    //   return result.rows
    // };
    return result.rows.map((row) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type
        }
    }));
};
const updateBooking = async (bookingId, user) => {
    // 1. Fetch booking
    const bookingResult = await db_1.pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (bookingResult.rows.length === 0) {
        throw new Error("Booking not found");
    }
    const booking = bookingResult.rows[0];
    // 2. Get logged-in user's ID (since req.user.id is missing)
    const userRow = await db_1.pool.query(`SELECT id FROM Users WHERE email = $1`, [user.email]);
    if (userRow.rows.length === 0) {
        throw new Error("User not found");
    }
    const userId = userRow.rows[0].id;
    // ───────────────────────────────────────────────
    //               CUSTOMER CANCEL BOOKING
    // ───────────────────────────────────────────────
    if (user.role === "customer") {
        if (booking.customer_id !== userId) {
            throw new Error("You can cancel only your own booking");
        }
        if (new Date(booking.rent_start_date) <= new Date()) {
            throw new Error("Cannot cancel booking that already started");
        }
        const updated = await db_1.pool.query(`UPDATE bookings 
       SET status='cancelled' 
       WHERE id=$1
       RETURNING *`, [bookingId]);
        await db_1.pool.query(`UPDATE Vehicles 
       SET availability_status='available'
       WHERE id=$1`, [booking.vehicle_id]);
        return {
            success: true,
            message: "Booking cancelled successfully",
            data: updated.rows[0],
        };
    }
    if (user.role === "admin") {
        const updated = await db_1.pool.query(`UPDATE bookings 
       SET status='returned' 
       WHERE id=$1
       RETURNING *`, [bookingId]);
        const vehicle = await db_1.pool.query(`UPDATE Vehicles 
       SET availability_status='available'
       WHERE id=$1
       RETURNING availability_status`, [booking.vehicle_id]);
        return {
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: {
                ...updated.rows[0],
                vehicle: {
                    availability_status: vehicle.rows[0].availability_status,
                },
            },
        };
    }
    throw new Error("Unauthorized action");
};
exports.bookingService = {
    getBookings,
    updateBooking,
    createBooking
};
