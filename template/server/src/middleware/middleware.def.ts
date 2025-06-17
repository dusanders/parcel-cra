import { Application } from "express";

/**
 * Define contract for all middleware classes
 */
export interface IMiddleware {
  attach(app: Application): Application;
}

/**
 * Define contract for all api endpoint handlers
 */
export interface IHandleApi {
  /**
   * Register the middleware for routes on the Express instance
   * @param app 
   */
  listenForRoutes(app: Application): Application;
}