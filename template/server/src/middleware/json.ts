import { Application, json } from "express";
import { IMiddleware } from "./middleware.def";

export class JsonMiddleware implements IMiddleware {
  attach(express: Application): Application {
    express.use(json());
    return express;
  }

}