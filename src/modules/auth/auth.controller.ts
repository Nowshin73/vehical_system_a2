import { Request, Response } from "express";
import { authServices, loginUserIntoDB } from "./auth.service";
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
const loginUser =async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginUserIntoDB(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token, user },
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
    loginUser,
    createUser
}