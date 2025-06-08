import { Application } from "express";
import { IMiddleware } from "../middleware.def";
import { Api } from "../../../../shared/routes/api";
import { BaseApiHandler } from "./base";
import { InteropRequests } from "../../../../shared/requests/interop";
import { exec, ExecException, spawn } from "node:child_process";
import { InteropResponses } from "../../../../shared/responses/interop";


interface ExecResult {
  error: ExecException | null;
  stdout: string;
  stderr: string;
}

export class InteropMiddleware extends BaseApiHandler implements IMiddleware {
  attach(app: Application): Application {
    this.useValidator(app)
      .post(Api.Interop.exec, async (req, res, next) => {
        if (!InteropRequests.Validator.isExecCommand(req.body)) {
          this.returnError({
            httpStatus: 400,
            message: 'bad model',
            internalCode: 400
          })
        } else {
          this.sendResponse(res, await this.execCommand(req.body));
        }
      });
    return app;
  }

  private useValidator(app: Application): Application {
    app.post(Api.Interop.exec, (req, res, next) => {
      if (!InteropRequests.Validator.isExecCommand(req.body)) {
        this.returnError({
          httpStatus: 400,
          message: 'bad model',
          internalCode: 400
        });
      } else {
        next();
      }
    })
    return app;
  }

  private async execCommand(model: InteropRequests.ExecCommand): Promise<InteropResponses.ExecCommand> {
    const child = await this.awaitExec(model.command);
    return {
      error: child.error?.message,
      stderr: child.stderr || '',
      stdout: child.stdout || ''
    }
  }

  private awaitExec(command: string): Promise<ExecResult> {
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        resolve({
          error: error,
          stdout: stdout,
          stderr: stderr
        })
      })
    })
  }
}