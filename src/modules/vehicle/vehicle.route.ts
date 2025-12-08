import { Router } from "express";
import auth from "../../middleware/auth";
import {  vehicleController } from "./vehicle.controller";



const router = Router();

router.post("/", auth("admin"), vehicleController.createVehicle);
router.get("/",  vehicleController.getAllVehicles);
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);
// router.put("/:vehicleId", auth("admin", "customer"), vehicleController.updateVehicle);
router.get("/:vehicleId", vehicleController.getVehicleDetail);
//router.get("/", auth(Roles.admin), userController.getAllUser);
// router.get("/singleuser", auth(Roles.user,Roles.user), userController.getSingleUser);
export const vehicleRoute = router;