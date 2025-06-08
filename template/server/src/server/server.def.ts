import { IHandleApi, IMiddleware } from "../middleware/middleware.def";

/**
 * Define the contract for all ExpressJS server classes
 */
export interface IServer {
  /**
   * Attach a middleware pipeline to the express request chain
   * @param middleware Middleware to attach
   */
  addMiddleware(middleware: IMiddleware): IServer;
  /**
   * Attach an API handler to the express request chain
   * @param handler API Handler
   */
  addApiHandler(handler: IHandleApi): IServer;
  /**
   * Start the server
   */
  start(): Promise<IServer>;
  /**
   * Stop the server
   */
  stop(): void;
}