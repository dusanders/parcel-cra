import { Application, static as ExpressStatic } from "express";
import { IMiddleware } from "./middleware.def";
import * as Path from 'path';
import { Log } from "../services/logger/logger";
import { Pages } from "../../../shared/pages";

export class StaticMiddleware implements IMiddleware {
  private TAG = 'StaticMiddleware';
  private wwwRoot: string = '';
  constructor(wwwRoot: string) {
    this.wwwRoot = wwwRoot;
  }
  attach(express: Application): Application {
    const root = Path.resolve(this.wwwRoot);
    Log.i(this.TAG, `Serve from: ${root}`);
    
    express.get(Pages.home, (req, res, next) => {
      res.sendFile(Path.resolve(`${root}/index.html`));
    });
    express.get(Pages.login, (req, res, next) => {
      res.sendFile(Path.resolve(`${root}/index.html`));
    });
    express.get('/', (req, res, next) => {
      res.sendFile(Path.resolve(`${root}/index.html`));
    });
    express.use(ExpressStatic(root));
    return express;
  }
}