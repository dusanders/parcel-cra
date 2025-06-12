import { Application, NextFunction, Request, Response } from "express";
import { IHandleApi } from "../middleware.def";
import { Api } from "../../../../shared/routes/api";
import { BaseApiHandler } from "./base";
import { InteropRequests } from "../../../../shared/requests/interop";
import { InteropResponses } from "../../../../shared/responses/interop";
import { Log } from "../../services/logger/logger";
import { ProcessService } from "../../services/process/process";
import * as Path from "path";

export class InteropMiddleware extends BaseApiHandler implements IHandleApi {
  private tag = 'InteropMiddleware';

  listenForRoutes(app: Application): Application {
    app.post(Api.Interop.exec,
      (req, res, next) => { this.validateForRoute(req, res, next) },
      async (req, res) => {
        this.sendResponse(res, await this.execCommand(req.body));
      });
    app.post(Api.Interop.scanDirectory,
      (req, res, next) => { this.validateForRoute(req, res, next) },
      async (req, res) => {
        this.sendResponse(res, await this.scanDirectory(req.body));
      });
    app.post(Api.Interop.searchGitBranches,
      (req, res, next) => { this.validateForRoute(req, res, next) },
      async (req, res) => {
        this.sendResponse(res, await this.gitSearchBranches(req.body));
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
      case Api.Interop.scanDirectory:
        if (InteropRequests.Validator.isScanDirectory(req.body)) {
          next();
          return;
        }
        break;
      case Api.Interop.searchGitBranches:
        if (InteropRequests.Validator.isGitSearchBranches(req.body)) {
          next();
          return;
        }
        break;
    }
    Log.e(this.tag, `Route validator DEFAULT ERROR for ${req.path} with body ${JSON.stringify(req.body)}`);
    this.sendError(res, {
      httpStatus: 400,
      message: 'route not found in /api/interop',
      internalCode: 9404
    })
  }

  /**
   * Get the base directory of this source file
   * @returns The base directory of this source file
   */
  private getBaseDirectory(): string {
    // This file is pretty deep in the server structure, so we need to go up a lot
    return Path.resolve(__dirname, '../../../../../../../..');
  }

  /**
   * Scan a directory and return the list of files
   * @param model 
   * @returns 
   */
  private async scanDirectory(model: InteropRequests.ScanDirectory): Promise<InteropResponses.ScanDirectory> {
    const toScanDirectory = model.directory || this.getBaseDirectory();
    const scanCommand = `ls ${toScanDirectory}`;
    const result = await ProcessService.getInstance().runCommand(scanCommand, this.getBaseDirectory());
    if (result.error) {
      Log.e(this.tag, `Error scanning directory: ${result.error}`);
      return { files: [], scanDirectory: toScanDirectory };
    }
    Log.i(this.tag, `Scanned directory: ${this.getBaseDirectory()} with result: ${result.stdout}`);
    const files = result.stdout.split('\n').filter(file => file.trim() !== '');
    return { files: files, scanDirectory: toScanDirectory };
  }

  /**
   * Search git branches for a git repo within the given root directory. Also returns the origin url if found.
   * @param model 
   * @returns 
   */
  private async gitSearchBranches(model: InteropRequests.GitSearchBranches): Promise<InteropResponses.GitSearchBranches> {
    const gitCommand = `git branch --list -a ${model.pattern}`;
    const result = await ProcessService.getInstance().runCommand(gitCommand, model.rootDirectory);
    if (result.error) {
      Log.e(this.tag, `Error searching git branches: ${result.error}`);
      return { branches: [], originUrl: '' };
    }
    Log.i(this.tag, `Searched git branches in ${model.rootDirectory} with result: ${result.stdout}`);
    const branches = result.stdout
      .replace('*', '')
      .trim()
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);
    const originResult = await ProcessService.getInstance().runCommand('git config --get remote.origin.url', model.rootDirectory);
    const originUrl = originResult.error ? '' : originResult.stdout.trim();
    return { branches: branches, originUrl: originUrl };
  }

  /**
   * Execute a command and return the result
   * @param model InteropRequests.ExecCommand
   * @returns InteropResponses.ExecCommand
   */
  private async execCommand(model: InteropRequests.ExecCommand): Promise<InteropResponses.ExecCommand> {
    return await ProcessService.getInstance().runCommand(model.command, model.cwd);
  }
}