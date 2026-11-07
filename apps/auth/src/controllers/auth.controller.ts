import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import {
  RegisterUserDto,
  LoginDto,
  ConfirmEmailDto,
  RequestPasswordResetDto,
  ConfirmPasswordResetDto,
} from '../services/dto/auth.dto.js';

// Handles REST endpoints for user authentication and credentials lifecycle
export class AuthController {
  constructor(
    private authService: AuthService,
    private requireEmailConfirmation: boolean = true
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = RegisterUserDto.parse(req.body);
      const user = await this.authService.register(validated, {
        requireEmailConfirmation: this.requireEmailConfirmation,
      });

      res.status(201).json({
        success: true,
        status: 'created',
        message: 'User registered successfully',
        data: {
          uuid: user.uuid,
          sub: user.sub,
          email: user.email,
          username: user.username,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = LoginDto.parse(req.body);
      const result = await this.authService.login(validated);

      res.status(200).json({
        success: true,
        status: 'authenticated',
        data: {
          uuid: result.user.uuid,
          sub: result.sub,
          email: result.user.email,
          username: result.user.username,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = ConfirmEmailDto.parse(req.query);
      await this.authService.confirmEmail(validated);

      res.status(200).json({
        success: true,
        status: 'email_confirmed',
        message: 'Email confirmed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = RequestPasswordResetDto.parse(req.body);
      await this.authService.requestPasswordReset(validated);

      res.status(200).json({
        success: true,
        status: 'reset_requested',
        message: 'If the email exists, a password reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  };

  confirmPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = ConfirmPasswordResetDto.parse(req.body);
      await this.authService.confirmPasswordReset(validated);

      res.status(200).json({
        success: true,
        status: 'password_reset_confirmed',
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
