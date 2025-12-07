import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import config from "../../config";
import jwt from "jsonwebtoken";
export const secret = config.jwt_secret;


const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `
      INSERT INTO Users(name,email,password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
    `,
    [name, email, hashPassword, phone, role]
  );

  return result;
};


export const loginUserIntoDB = async (email: string, password: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found!");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid Credentials!");

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const token = jwt.sign(payload, secret as string, { expiresIn: "7d" });

  delete user.password;

  return { token, user };
};

export const authServices = {
  loginUserIntoDB,
  createUser
};