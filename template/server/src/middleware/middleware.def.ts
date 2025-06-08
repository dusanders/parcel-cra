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
  listenForRoutes(app: Application): Application;
}