import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../database/db";
import config from "../config";

const secret = config.jwt_secret;

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      if (!header) return res.status(403).json({message:"forbidden"});

      const token = header.split(" ")[1];
      if (!token) res.status(401).json({ message:"You are not allowed!"})

      const decoded = jwt.verify(token as string, secret as string) as JwtPayload;

      //const user = 
      // await pool.query(`SELECT * FROM users WHERE id=$1`, [
      //   decoded.id,
      // ]);
      //if (user.rows.length === 0) throw new Error("User not found");

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(401).json({ message:"unauthorized!!"})
      }
      next();
    } catch (e: any) {
      res.status(401).json({
        success: false,
        message: e.message,
      });
    }
  };
};

export default auth;
