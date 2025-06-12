import { Application, NextFunction, Response, Request } from "express";
import { IHandleApi } from "../middleware.def";
import { BaseApiHandler } from "./base";
import { UserRequests } from "../../../../shared/requests/user";
import { UserResponses } from "../../../../shared/responses/user";
import { IDatabase } from "../../services/database/database.def";
import { Api } from "../../../../shared/routes/api";
import { ServerError } from "../../../../shared/responses/base";
import { Log } from "../../services/logger/logger";
import { AuthenticationService } from "../../services/auth/auth";

/**
 * API handler for /api/user/*
 */
export class UserHandler extends BaseApiHandler implements IHandleApi {
  private tag = 'UserHandler';
  private database: IDatabase;
  private authService: AuthenticationService;
  constructor(database: IDatabase, auth: AuthenticationService) {
    super();
    this.database = database;
    this.authService = auth;
  }
  /**
   * Attach the route handlers for the express app
   * @param app ExpressJS app instance
   * @returns 
   */
  listenForRoutes(app: Application): Application {
    // app.use(Api.User.BASE, (req, res, next) => {
    //   this.validateForRoute(req, res, next);
    // });
    app.post(Api.User.create,
      (req, res, next) => {
        this.validateForRoute(req, res, next);
      },
      async (req, res, next) => {
        this.sendResponse(res, await this.createUser(req.body))
      }
    );
    app.post(Api.User.update,
      (req, res, next) => {
        this.validateForRoute(req, res, next);
      },
      async (req, res, next) => {
        this.sendResponse(res, await this.updateUser(req.body))
      }
    )
    return app;
  }

  private async updateUser(body: UserRequests.Update): Promise<UserResponses.Update | ServerError> {
    const user = await this.database.getOrCreateUser(body.newValues);
    if (this.database.isError(user)) {
      return this.returnError({
        httpStatus: 404,
        message: 'User not found',
        internalCode: 404
      });
    }
    const updated = await user.updateEntity(body.newValues);
    return {
      user: updated.getClientModel()
    }
  }

  private async createUser(body: UserRequests.Create): Promise<UserResponses.Create | ServerError> {
    const user = await this.database.getOrCreateUser({
      name: body.name,
      secret: body.secret
    });
    Log.i(this.tag, `Create ${JSON.stringify(user)}`);
    if (this.database.isError(user)) {
      return this.returnError({
        httpStatus: 500,
        message: `DB failed: ${user.code} :: ${user.message}`,
        internalCode: 500
      });
    }
    if (user) {
      const authEntity = await user.authenticate(this.authService);
      authEntity.hasAuth = true;
      await user.updateEntity(authEntity);
      return {
        user: user.getClientModel()
      }
    }
    return this.returnError({
      httpStatus: 500,
      message: 'Failed to create user',
      internalCode: 500
    });
  }

  private validateForRoute(req: Request, res: Response, next: NextFunction) {
    Log.i(this.tag, `route validator: ${req.path} - ${JSON.stringify(req.body)}`)
    switch (req.path) {
      case Api.User.create:
        if (UserRequests.Validator.isCreate(req.body)) {
          Log.i(this.tag, `model is validated`)
          next();
          return;
        }
        break;
      case Api.User.update:
        if (UserRequests.Validator.isUpdate(req.body)) {
          Log.i(this.tag, `model is validated`)
          next();
          return;
        }
        break;
    }
    Log.e(this.tag, `Route validator DEFAULT ERROR for ${req.path} with body ${req.body}`);
    this.sendError(res, {
      httpStatus: 404,
      message: 'route not found in /user',
      internalCode: 9404
    })
  }
}