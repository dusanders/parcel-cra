import { NextFunction, Request, Response } from "express";
import { JWTService } from "./jwt/jwt";
import { User } from "../../../../shared";
import { Log } from "../logger/logger";

export class AuthenticationService {
  private TAG = 'AuthenticationMiddleware';
  private jwt: JWTService;
  private allowedUsers: Map<string, User>;
  constructor(jwt: JWTService) {
    this.jwt = jwt;
    this.allowedUsers = new Map();
  }

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
  checkUser(user: User) {
    if (this.allowedUsers.has(user.name)) {
      return true;
    }
    return false;
  }
  getJwtForUser(user: User) {
    return this.jwt.signJwt();
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