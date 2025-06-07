import { Application } from "express";

export interface IMiddleware {
  attach(app: Application): Application;
}

export interface IHandleApi {
  listenForRoutes(app: Application): Application;
}