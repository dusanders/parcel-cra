import { Application } from "express";
import { IHandleApi } from "../middleware.def";
import { BaseApiHandler } from "./base";
import { UserRequests } from "../../../../shared/requests/user";
import { UserResponses } from "../../../../shared/responses/user";
import { IDatabase } from "../../services/database/database.def";
import { Api } from "../../../../shared/routes/api";
import { ServerError } from "../../../../shared/responses/base";

/**
 * API handler for /api/user/*
 */
export class UserHandler extends BaseApiHandler implements IHandleApi {
  private database: IDatabase;
  constructor(database: IDatabase) {
    super();
    this.database = database;
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
    if (!user.failed) {
      return {
        user: user.result.getClientModel()
      }
    }
    const error: ServerError = {
      httpStatus: 500,
      message: 'failed to create user',
      internalCode: 'db broken'
    }
    return error;
  }
}