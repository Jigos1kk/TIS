import { NextFunction, Request, Response } from "express";
import { registerSchema } from "../validator/index.js";
import { ZodError } from "zod";
import { userRepository } from "../database/repository/index.js";

export async function registerMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const registerData = await registerSchema.parseAsync(req.body);
        const existingEmail = await userRepository.findByEmailNormalize(registerData.emailNormalize);
        const existingUsername = await userRepository.findByUsernameNormalize(registerData.usernameNormalize);
        
        if (existingEmail) {
            throw new ZodError([
                {
                    code: "custom",
                    path: ["email"],
                    message: "User with this email has already registered"
                }
            ]);
        }

        if (existingUsername) {
            throw new ZodError([
                {
                    code: "custom",
                    path: ["username"],
                    message: "User with this username has already registered"
                }
            ]);
        }
            
        req.body = registerData;
        next();
    } catch (error) {
        const e = error instanceof ZodError ? error.flatten() : error;
        res.status(400).json({
            success: false,
            status: "validation_error",
            error: e
        });
    }
}