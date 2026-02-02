import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

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
const getSingleUser = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM Users WHERE id=$1
    `,
    [id]
  );

  return result;
};
const getUserById = async (id: string) => {
  const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return res.rows[0] || null;
};

const updateUser = async (
  payload: Record<string, unknown>,
  id: string,
  loggedInUserRole: string
) => {
  const { name, email, phone, role } = payload;

  if (loggedInUserRole === "admin") {
    // Admin can update everything
    const result = await pool.query(
      `UPDATE Users 
       SET name=$1, email=$2, phone=$3, role=$4 
       WHERE id=$5 
       RETURNING id,name,email,phone,role`,
      [name, email, phone, role, id]
    );
    return result.rows[0];
  }

  // Customer rules
  if (loggedInUserRole === "customer" && role !== undefined && role !== "customer") {
    throw new Error("Customer can't change role");
  }

  const result = await pool.query(
    `UPDATE Users 
     SET name=$1, email=$2, phone=$3 
     WHERE id=$4 
     RETURNING id,name,email,phone,role`,
    [name, email, phone, id]
  );

  return result.rows[0];
};

const checkActiveBookings = async (userId: string) => {
  return await pool.query(
    `
    SELECT * FROM bookings 
    WHERE customer_id = $1 AND status = 'active'
    `,
    [userId]
  );
};

export const userServices = {
  getAllUser,
  getSingleUser,
  getUserById,
  deleteUser,
  updateUser,
  checkActiveBookings
};