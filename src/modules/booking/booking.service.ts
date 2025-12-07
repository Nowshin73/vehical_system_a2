import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  //const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `
      INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date ) VALUES($1,$2,$3,$4) RETURNING id,customer_id, vehicle_id, rent_start_date, rent_end_date
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date]
  );

  return result;
};

const getAllUser = async () => {
  const result = await pool.query(
    `
    SELECT id,name,email,phone,role FROM Users
    `
  );

  return result;
};

const deleteUser = async (userId: string) => {
 const result = await pool.query(`DELETE FROM Users WHERE id = $1`, [userId]);
 return result;
}
const getSingleUser = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id,name,email,phone,role FROM users WHERE email=$1
    `,
    [email]
  );

  return result;
};

const updateUser = async (payload: Record<string, unknown>, id:string)=>{
   const {  name, email, phone, role } = payload;
   const result = await pool.query(
      `UPDATE Users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id,name,email,phone,role`,
      [name, email, phone, role, id])
   return result;
}
export const userServices = {
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser
};