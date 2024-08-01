import { NextFunction, Request, Response } from 'express';
import { Container, Token } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { NODE_ENV } from '@/config';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { tokenData, userWithoutPassword } = await this.auth.login(userData);

      res.cookie('Authorization', tokenData.token, {
        httpOnly: true,
        maxAge: tokenData.expiresIn * 1000,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      res.status(200).json({ data: userWithoutPassword, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('Authorization', { path: '/' });
      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
