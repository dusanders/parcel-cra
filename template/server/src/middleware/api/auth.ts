import { Application, NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../../services/auth/auth";
import { IHandleApi } from "../middleware.def";
import { User } from "../../../../shared";
import { BaseApiHandler } from "./base";
import { UserRequests } from "../../../../shared/requests/user";
import { Api } from "../../../../shared/routes/api";
import { UserResponses } from "../../../../shared/responses/user";
import { ServerError } from "../../../../shared/responses/base";

/**
 * Authentication API handler. Handles /api/user/auth (login) requests as well.
 */
export class AuthHandler extends BaseApiHandler implements IHandleApi {
  private auth: AuthenticationService;
  constructor(auth: AuthenticationService) {
    super();
    this.auth = auth;
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
    express.get(Api.User.verify,
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
    let checkModel: User = {
      name: req.name,
      hasAuth: false,
      jwt: ''
    };
    if (this.auth.checkUser(checkModel)) {
      checkModel.jwt = await this.auth.getJwtForUser(checkModel);
      return {
        user: checkModel
      };
    }
    let notallowed: ServerError = {
      httpStatus: 403,
      message: 'not allowed',
      internalCode: 'oops'
    };
    return notallowed;
  }
}