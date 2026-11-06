import { Request, Response, NextFunction } from "express";
import { userService, UserService } from "../services/user.service.js";
import { ReqRegisterDto } from "../services/dto/register.dto.js";

export class AuthController {
  constructor(private userServiceInstance: UserService = userService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as ReqRegisterDto;
      const result = await this.userServiceInstance.register(dto);

      res.status(201).json({
        success: true,
        status: result.status,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
