import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const deleteUser = async (req:Request, res:Response) =>{
   try {
      const result = await userServices.deleteUser(req.params.userId!)
  
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
          data: result.rows,
        });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
}
const updateUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
 // const { name, email } = req.body;
  try {
    const result = await userServices.updateUser(req.body,req.params.userId!);
   
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const email = req.user!.email
    const result = await userServices.getSingleUser(email);
    return res.status(201).json({
      success: true,
      message: "User created",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export const userController = {
   getAllUser,
   getSingleUser,
   deleteUser,
   updateUser
};