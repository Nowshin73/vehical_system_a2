import { pool } from "../../database/db";
import dayjs from "dayjs";

export const createBookingInDB = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Get vehicle data
  const vehicleQuery = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1`,
    [vehicle_id]
  );
  if (vehicleQuery.rows.length === 0) throw new Error("Vehicle not found");

  const vehicle = vehicleQuery.rows[0];

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle already booked");
  }

  const days = dayjs(rent_end_date).diff(dayjs(rent_start_date), "day");
  if (days <= 0) throw new Error("Invalid date range");

  const total_price = days * vehicle.daily_rent_price;

  const insertBooking = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1,$2,$3,$4,$5,'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [
    vehicle_id,
  ]);

  return insertBooking.rows[0];
};
export const updateBookingStatus = async (id: number, status: string, role: string) => {
  const data = await pool.query(
    `SELECT * FROM bookings WHERE id=$1`,
    [id]
  );

  if (data.rows.length === 0) throw new Error("Booking not found");

  const booking = data.rows[0];

  if (role === "customer" && status !== "cancelled") {
    throw new Error("Customers can only cancel bookings");
  }

  await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2`,
    [status, id]
  );

  if (status === "returned" || status === "cancelled") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  return { ...booking, status };
};
