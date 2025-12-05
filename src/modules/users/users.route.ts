import { Router } from "express";
import { userController } from "./users.controller";


const router = Router();

router.post("/", userController.createUser);
// router.get("/", auth(Roles.admin), userController.getAllUser);
router.get("/", userController.getAllUser);
// router.get("/singleuser", auth(Roles.user,Roles.user), userController.getSingleUser);
router.get("/singleuser", userController.getSingleUser);
export const customersRoute = router;