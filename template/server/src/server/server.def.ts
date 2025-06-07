import { IHandleApi, IMiddleware } from "../middleware/middleware.def";

export interface IServer {
  addMiddleware(middleware: IMiddleware): IServer;
  addApiHandler(handler: IHandleApi): IServer;
  start(): Promise<IServer>;
  stop(): void;
}