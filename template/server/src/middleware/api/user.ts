import { Application } from "express";
import { IHandleApi } from "../middleware.def";
import { BaseApiHandler } from "./base";
import { Api } from "../../../../shared/api";
import { UserRequests } from "../../../../shared/requests/user";
import { UserResponses } from "../../../../shared/responses/user";
import { IDatabase } from "../../services/database/database.def";

export class UserHandler extends BaseApiHandler implements IHandleApi {
  private database: IDatabase;
  constructor(database: IDatabase) {
    super();
    this.database = database;
  }
  listenForRoutes(app: Application): Application {
    app.post(Api.User.create,
      async (req, res, next) => {
        this.sendResponse(res, await this.createUser(req.body))
      }
    );
    return app;
  }

  private async createUser(body: UserRequests.Create): Promise<UserResponses.Create> {
    const user = await this.database.getOrCreateUser({
      name: body.name,
      secret: body.secret
    });
    if (!user.failed) {
      return {
        user: user.result.getClientModel()
      }
    }
    return {
      serverError: {
        httpStatus: 500,
        message: 'failed to create user',
        internalCode: 'db broken'
      }
    }
  }
}