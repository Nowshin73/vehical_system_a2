import { pool } from "../../database/db";

 const createBooking = async (
  payload: any,
  user: any
) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required!");
  }

 
  if (new Date(rent_end_date) <= new Date(rent_start_date)) {
    throw new Error("End date must be after start date");
  }

  const vehicle = await pool.query(
    `SELECT * FROM Vehicles WHERE id = $1 AND availability_status = 'available'`,
    [vehicle_id]
  );

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle is not available for booking");
  }

  const dailyPrice = Number(vehicle.rows[0].daily_rent_price);
  const days =
    (new Date(rent_end_date).getTime() -
      new Date(rent_start_date).getTime()) /
    (1000 * 60 * 60 * 24);

  const total_price = dailyPrice * days;


  const booking = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [user.id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );


  await pool.query(
    `UPDATE Vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return booking.rows[0];
};




 const getBookings = async (user: any) => {
  if (user.role === "admin") {
   
    const result = await pool.query(`SELECT * FROM bookings`);
    return result.rows;
  }


  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1`,
    [user.id]
  );
  return result.rows;
};





 const updateBooking = async (bookingId: string, user: any) => {
 
  const booking = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (booking.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const b = booking.rows[0];


  if (user.role === "customer") {
    if (b.customer_id !== user.id) {
      throw new Error("You can cancel only your own booking");
    }

    if (new Date(b.rent_start_date) <= new Date()) {
      throw new Error("Cannot cancel booking that already started");
    }


    await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1`,
      [bookingId]
    );

 
    await pool.query(
      `UPDATE Vehicles SET availability_status='available'
       WHERE id=$1`,
      [b.vehicle_id]
    );

    return { message: "Booking cancelled" };
  }


  if (user.role === "admin") {
    await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1`,
      [bookingId]
    );

    await pool.query(
      `UPDATE Vehicles SET availability_status='available'
       WHERE id=$1`,
      [b.vehicle_id]
    );

    return { message: "Vehicle returned", data: b };
  }

  throw new Error("Unauthorized action");
};


export const bookingService = {
  getBookings,
  updateBooking,
  createBooking
}