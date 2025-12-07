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