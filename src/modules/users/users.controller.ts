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
  try {
    const loggedInUser= req.user as JwtPayload;
    const targetUserId = req.params.userId as string;
    const { role, ...restPayload } = req.body;
   
    if (loggedInUser.role === "customer" && loggedInUser.id !== targetUserId) {
      return res.status(403).json({
        success: false,
        message: "Customers can update only their own profile",
      });
    }

  
    if (loggedInUser.role === "customer" && role) {
      return res.status(403).json({
        success: false,
        message: "Customers cannot change role",
      });
    }


    const finalPayload =
      loggedInUser.role === "customer"
        ? restPayload
        : req.body; 

    const result = await userServices.updateUser(finalPayload, targetUserId);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
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