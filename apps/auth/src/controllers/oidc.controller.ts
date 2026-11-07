import { Request, Response, NextFunction } from 'express';
import Provider from 'oidc-provider';

// Handles OIDC interaction prompts such as login and consent
export class OidcController {
  constructor(private provider: Provider) {}

  renderInteraction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const interaction = await this.provider.interactionDetails(req, res);
      const { prompt, params } = interaction;

      if (prompt.name === 'login') {
        res.status(200).json({
          success: true,
          status: 'interaction_required',
          type: 'interaction',
          prompt: 'login',
          uid: interaction.uid,
          params,
          message: 'Interaction required. Redirect client to external frontend.',
        });
        return;
      }

      if (prompt.name === 'consent') {
        const result = {
          consent: {},
        };
        await this.provider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: true,
        });
        return;
      }

      res.status(200).json({
        success: true,
        status: 'interaction_handled',
        type: 'interaction',
        prompt: prompt.name,
        uid: interaction.uid,
      });
    } catch (error) {
      next(error);
    }
  };

  submitLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { accountId } = req.body;
      const result = {
        login: {
          accountId,
        },
      };

      await this.provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: false,
      });
    } catch (error) {
      next(error);
    }
  };
}
