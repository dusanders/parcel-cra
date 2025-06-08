import { Application } from "express";
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
    app.post(Api.User.create,
      async (req, res, next) => {
        this.sendResponse(res, await this.createUser(req.body))
      }
    );
    return app;
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
}