"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.authController.createUser);
router.post('/login', auth_controller_1.authController.loginUser);
exports.authRoute = router;
