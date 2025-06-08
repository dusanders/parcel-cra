import { Application, json } from "express";
import { IMiddleware } from "./middleware.def";

/**
 * Middleware to convert request body to JSON objects
 */
export class JsonMiddleware implements IMiddleware {
  attach(express: Application): Application {
    express.use(json());
    return express;
  }

}