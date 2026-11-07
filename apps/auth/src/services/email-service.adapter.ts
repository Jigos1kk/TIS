import { IEmailService } from '../services/email.interface.js';

// Console logging stub for email notifications without external transport
export class EmailServiceAdapter implements IEmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    console.log(`[EmailService] Verification token for ${email}: ${token}`);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    console.log(`[EmailService] Password reset token for ${email}: ${token}`);
  }
}
