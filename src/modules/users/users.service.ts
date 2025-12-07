import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `
      INSERT INTO Users(name,email,password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
    `,
    [name, email, hashPassword, phone, role]
  );

  //   delete result.rows[0].password

  return result;
};

const getAllUserIntoDB = async () => {
  const result = await pool.query(
    `
    SELECT id,name,email,age,created_at,updated_at FROM users
    `
  );

  return result;
};

const getSingleUserIntoDB = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id,name,email,age,created_at,updated_at FROM users WHERE email=$1
    `,
    [email]
  );

  return result;
};

export const userServices = {
  createUser,
  getAllUserIntoDB,
  getSingleUserIntoDB,
};