import { Request, Response } from "express";
import { userServices } from "./users.service";
import { JwtPayload } from "jsonwebtoken";

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
      
       const activeBookings = await userServices.checkActiveBookings(req.params.userId!);

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user: User has active bookings"
      });
    }
     else{
      const result = await userServices.deleteUser(req.params.userId!)
  
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      } 
      else {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
         
        });
      }
     }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
}
const updateUser = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user as JwtPayload;
    const targetUserId = req.params.userId;

    // 1️⃣ Get user from DB
    const result = await userServices.getUserById(targetUserId!);
   // const targetUser = result?.rows?.[0];

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Customers can update ONLY their own profile
    if (loggedInUser.role === "customer" && loggedInUser.email !== result.email) {
      return res.status(403).json({
        success: false,
        message: "Customers can update only their own profile",
      });
    }

    // 3️⃣ Update based on role
    const updatedUser = await userServices.updateUser(
      req.body,
      targetUserId!,
      loggedInUser.role
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getSingleUser = async (req: Request, res: Response) => {
  try {
   // const email = req.user!.email
    const result = await userServices.getSingleUser(req.params.userId!);
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
   updateUser,
};