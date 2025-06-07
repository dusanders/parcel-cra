import { Application, NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../../services/auth/auth";
import { IHandleApi } from "../middleware.def";
import { Api } from "../../../../shared/api";
import { LoginResponses } from "../../../../shared/responses/login";
import { User } from "../../../../shared";
import { BaseApiHandler } from "./base";
import { LoginRequests } from "../../../../shared/requests/login";
import { BaseResponse } from "../../../../shared/responses/base";

export class AuthHandler extends BaseApiHandler implements IHandleApi {
  private auth: AuthenticationService;
  constructor(auth: AuthenticationService) {
    super();
    this.auth = auth;
  }

  private validateForRoute(route: string, req: Request, res: Response, next: NextFunction) {
    let valid = false;
    switch (route) {
      case Api.Auth.login:
        valid = LoginRequests.Validator.isLoginRequest(req.body);
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
    express.post(Api.Auth.login,
      (req, res, next) => { this.validateForRoute(Api.Auth.login, req, res, next) },
      async (req, res, next) => {
        this.sendResponse(res, await this.login(req.body));
      }
    );
    express.get(Api.Auth.verify,
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

  async login(req: LoginRequests.LoginRequest): Promise<LoginResponses.LoginResponse> {
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
    let notallowed: LoginResponses.LoginResponse = {
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