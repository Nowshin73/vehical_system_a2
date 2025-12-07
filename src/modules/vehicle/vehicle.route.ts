import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./users.controller";
import { vehicleController } from "./vehicle.controller";


const router = Router();

router.post("/", vehicleController.createVehicle);
router.get("/",  vehicleController.getAllVehicles);
router.delete("/:vehicleId", vehicleController.deleteVehicle);
router.put("/:vehicleId", vehicleController.updateVehicle);
router.get("/:vehicleId", vehicleController.getVehicleDetail);
//router.get("/", auth(Roles.admin), userController.getAllUser);
// router.get("/singleuser", auth(Roles.user,Roles.user), userController.getSingleUser);
export const vehicleRoute = router;