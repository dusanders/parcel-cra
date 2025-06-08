import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared";
import { Log } from "../logger/logger";
import { IJwtService } from "./jwt/jwt.def";

/**
 * Class to implement authentication services
 */
export class AuthenticationService {

  private TAG = 'AuthenticationMiddleware';
  private jwt: IJwtService;
  private allowedUsers: Map<string, User>;

  constructor(jwt: IJwtService) {
    this.jwt = jwt;
    this.allowedUsers = new Map();
  }

  /**
   * Authenticate a Request based on the JWT token in header
   * @param req express Request object
   * @param res express Response object
   * @param next express NextFunction
   */
  authenticate(req: Request, res: Response, next: NextFunction) {
    const jwt = this.getJwtFromHeader(req);
    if (!this.jwt.isValid(jwt)) {
      Log.d(this.TAG, `failed jwt ${jwt}`);
      res.status(403);
      res.end();
    } else {
      next();
    }
  }

  /**
   * Verify the user has a valid JWT token
   * @param user 
   * @returns 
   */
  checkUser(user: User) {
    if (this.allowedUsers.has(user.name)) {
      return true;
    }
    return false;
  }

  /**
   * Create a JWT for a user
   * @param user 
   * @returns 
   */
  async getJwtForUser(user: User) {
    return await this.jwt.signJwt(user);
  }


  private getJwtFromHeader(req: Request): string {
    let jwtSplit = req.headers.authorization?.split(' ');
    Log.d(this.TAG, `got headers: ${JSON.stringify(jwtSplit)}`);
    if (!jwtSplit || jwtSplit.length < 2) {
      return '';
    }
    return jwtSplit[1] || '';
  }
}