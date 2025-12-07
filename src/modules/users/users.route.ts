import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./users.controller";


const router = Router();

//router.post("/", userController.createUser);
router.get("/",  userController.getAllUser);
router.delete("/:userId",  userController.deleteUser);
router.put("/:userId",  userController.updateUser);
//router.get("/", auth(Roles.admin), userController.getAllUser);
// router.get("/singleuser", auth(Roles.user,Roles.user), userController.getSingleUser);
export const userRoute = router;