"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const users_controller_1 = require("./users.controller");
const router = (0, express_1.Router)();
//router.post("/", userController.createUser);
router.get("/", (0, auth_1.default)("admin"), users_controller_1.userController.getAllUser);
router.delete("/:userId", (0, auth_1.default)("admin"), users_controller_1.userController.deleteUser);
router.put("/:userId", (0, auth_1.default)("admin", "customer"), users_controller_1.userController.updateUser);
//router.get("/", auth(Roles.admin), userController.getAllUser);
router.get("/:userId", (0, auth_1.default)("admin", "customer"), users_controller_1.userController.getSingleUser);
exports.userRoute = router;
