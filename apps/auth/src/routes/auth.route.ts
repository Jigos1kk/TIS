import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { registerMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerMiddleware, authController.register);

export default router;
