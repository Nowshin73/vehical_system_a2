import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./users.controller";
import { logger } from "../../middleware/logger";


const router = Router();

//router.post("/", userController.createUser);
router.get("/", auth("admin"), userController.getAllUser);
router.delete("/:userId", auth("admin"), userController.deleteUser);
router.put("/:userId", auth("admin","customer"), userController.updateUser);
//router.get("/", auth(Roles.admin), userController.getAllUser);
 router.get("/:userId", auth("admin","customer"), userController.getSingleUser);
export const userRoute = router;