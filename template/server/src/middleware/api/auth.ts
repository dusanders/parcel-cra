import { Application, NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../../services/auth/auth";
import { IHandleApi } from "../middleware.def";
import { User } from "../../../../shared";
import { BaseApiHandler } from "./base";
import { BaseResponse } from "../../../../shared/responses/base";
import { UserRequests } from "../../../../shared/requests/user";
import { Api } from "../../../../shared/routes/api";
import { UserResponses } from "../../../../shared/responses/user";

export class AuthHandler extends BaseApiHandler implements IHandleApi {
  private auth: AuthenticationService;
  constructor(auth: AuthenticationService) {
    super();
    this.auth = auth;
  }

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
    const errorModel: BaseResponse = {
      serverError: {
        httpStatus: 400,
        message: 'bad model',
        internalCode: 400
      }
    }
    this.sendResponse(res, errorModel);
  }

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

  checkAuth(): Promise<403 | 200> {
    // handled by the auth middleware
    throw new Error("Method not implemented.");
  }

  async login(req: UserRequests.Auth): Promise<UserResponses.Auth> {
    let checkModel: User = {
      name: req.name,
      hasAuth: false,
      jwt: ''
    };
    if (this.auth.checkUser(checkModel)) {
      checkModel.jwt = this.auth.getJwtForUser(checkModel);
      return {
        user: checkModel
      };
    }
    let notallowed: UserResponses.Auth = {
      serverError: {
        httpStatus: 403,
        message: 'not allowed',
        internalCode: 'oops'
      },
      user: undefined
    };
    return notallowed;
  }
}