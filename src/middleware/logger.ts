import { NextFunction, Request } from "express";

export const logger = (req: Request, res: Request, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};
