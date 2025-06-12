import { Application, NextFunction, Request, Response } from "express";
import { IHandleApi, IMiddleware } from "../middleware.def";
import { Api } from "../../../../shared/routes/api";
import { BaseApiHandler } from "./base";
import { InteropRequests } from "../../../../shared/requests/interop";
import { exec, ExecException, spawn } from "node:child_process";
import { InteropResponses } from "../../../../shared/responses/interop";
import { Log } from "../../services/logger/logger";


interface ExecResult {
  error: ExecException | null;
  stdout: string;
  stderr: string;
}

export class InteropMiddleware extends BaseApiHandler implements IHandleApi {
  private tag = 'InteropMiddleware';
  listenForRoutes(app: Application): Application {
    app.post(Api.Interop.exec,
      (req, res, next) => { this.validateForRoute(req, res, next) },
      async (req, res) => {
        this.sendResponse(res, await this.execCommand(req.body));
      });
    return app;
  }
  /**
   * Attach the route validators for the express app
   * @param app ExpressJS app instance
   * @returns 
   */
  private validateForRoute(req: Request, res: Response, next: NextFunction) {
    switch (req.path) {
      case Api.Interop.exec:
        if (InteropRequests.Validator.isExecCommand(req.body)) {
          next();
          return;
        }
        break;
    }
    Log.e(this.tag, `Route validator DEFAULT ERROR for ${req.path} with body ${JSON.stringify(req.body)}`);
    this.sendError(res, {
      httpStatus: 404,
      message: 'route not found in /user',
      internalCode: 9404
    })
  }

  /**
   * Execute a command and return the result
   * @param model InteropRequests.ExecCommand
   * @returns InteropResponses.ExecCommand
   */
  private async execCommand(model: InteropRequests.ExecCommand): Promise<InteropResponses.ExecCommand> {
    return new Promise<InteropResponses.ExecCommand>(async (resolve, reject) => {
      exec(model.command,
        { cwd: model.cwd },
        (error, stdout, stderr) => {
          resolve({
            error: error?.message,
            stdout: stdout,
            stderr: stderr
          })
        }
      );
    });
  }
}