import { Request, Response } from "express";
import { authServices } from "./auth.service";
const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
const loginUser = async(req : Request,res : Response)=>{
      try {
         const result = await authServices.loginUserIntoDB(req.body.email,req.body.password)
          return res.status(201).json({
            success: true,
            message: "User created",
            data: result,
          });
        } catch (error: any) {
          return res.status(500).json({
            success: true,
            message: error.message,
          });
        }
} 

export const authController = {
    loginUser,
    createUser
}