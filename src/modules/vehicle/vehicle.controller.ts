import { Request, Response } from "express";
import { userServices } from "./users.service";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0]
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req:Request, res:Response) =>{
   try {
      const result = await vehicleServices.deleteVehicle(req.params.vehicleId!)
  
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Vehicle deleted successfully",
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
const updateVehicle = async (req: Request, res: Response) => {
  // console.log(req.params.id);
 // const { name, email } = req.body;
  try {
    const result = await vehicleServices.updateVehicle(req.body,req.params.vehicleId!);
   
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
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
const getVehicleDetail = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateVehicle(req.body,req.params.vehicleId!);
    return res.status(201).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export const vehicleController = {
   createVehicle,
   getAllVehicles,
   getVehicleDetail,
   deleteVehicle,
   updateVehicle
};