"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const vehicle_controller_1 = require("./vehicle.controller");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("admin"), vehicle_controller_1.vehicleController.createVehicle);
router.get("/", vehicle_controller_1.vehicleController.getAllVehicles);
router.delete("/:vehicleId", (0, auth_1.default)("admin"), vehicle_controller_1.vehicleController.deleteVehicle);
router.put("/:vehicleId", (0, auth_1.default)("admin"), vehicle_controller_1.vehicleController.updateVehicle);
// router.put("/:vehicleId", auth("admin", "customer"), vehicleController.updateVehicle);
router.get("/:vehicleId", vehicle_controller_1.vehicleController.getVehicleDetail);
//router.get("/", auth(Roles.admin), userController.getAllUser);
// router.get("/singleuser", auth(Roles.user,Roles.user), userController.getSingleUser);
exports.vehicleRoute = router;
