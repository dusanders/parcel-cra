import { Application, NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../../services/auth/auth";
import { IHandleApi } from "../middleware.def";
import { BaseApiHandler } from "./base";
import { UserRequests } from "../../../../shared/requests/user";
import { Api } from "../../../../shared/routes/api";
import { UserResponses } from "../../../../shared/responses/user";
import { ServerError } from "../../../../shared/responses/base";
import { User } from "../../../../shared/models/user";
import { IDatabase } from "../../services/database/database.def";
import { IUserEntity } from "../../services/database/entity.def";

/**
 * Authentication API handler. Handles /api/user/auth (login) requests as well.
 */
export class AuthHandler extends BaseApiHandler implements IHandleApi {
  private auth: AuthenticationService;
  private database: IDatabase;
  constructor(auth: AuthenticationService, userDb: IDatabase) {
    super();
    this.auth = auth;
    this.database = userDb
  }

  /**
   * Validate the request models for each route
   * @param route 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  private validateForRoute(route: string, req: Request, res: Response, next: NextFunction) {
    let valid = false;
    switch (route) {
      case Api.User.login:
        valid = UserRequests.Validator.isAuthRequest(req.body);
        break;
    }
    if (valid) {
      return next();
    }
    const errorModel: ServerError = {
      httpStatus: 400,
      message: 'bad model',
      internalCode: 400
    }
    this.sendResponse(res, errorModel);
  }

  /**
   * Attach the middleware request handlers to express
   * @param express ExpressJS application
   * @returns 
   */
  listenForRoutes(express: Application): Application {
    express.post(Api.User.login,
      (req, res, next) => { this.validateForRoute(Api.User.login, req, res, next) },
      async (req, res, next) => {
        this.sendResponse(res, await this.login(req.body));
      }
    );
    express.use(Api.User.verify,
      (req, res, next) => {
        this.auth.authenticate(req, res, next)
      },
      (req, res) => {
        // Handled by the auth service above
        res.status(200);
        res.end();
      }
    );
    return express;
  }

  private checkAuth(): Promise<403 | 200> {
    // handled by the auth middleware
    throw new Error("Method not implemented.");
  }

  private async login(req: UserRequests.Auth): Promise<UserResponses.Auth | ServerError> {
    let checkModel: IUserEntity = {
      name: req.name,
      hasAuth: false,
      jwt: '',
      id: '',
      secret: req.secret
    };
    const found = await this.database.getOrCreateUser(checkModel);
    if(this.database.isError(found)) {
      return this.returnError({
        httpStatus: 403,
        message: 'no user found',
        internalCode: 'db error'
      });
    }
    if(found.getEntity().name !== req.name) {
      return this.returnError({
        httpStatus: 403,
        message: 'no user for name/pass',
        internalCode: 3403
      })
    } else if(found.getEntity().secret !== req.secret) {
      return this.returnError({
        httpStatus: 403,
        message: 'no user for name/pass',
        internalCode: 4403
      })
    }
    await found.authenticate(this.auth);
    return {
      user: found.getClientModel()
    }
  }
}