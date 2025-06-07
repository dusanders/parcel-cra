import { Application } from "express";
import { IMiddleware } from "./middleware.def";
import Cors from 'cors';

export class CorsMiddleware implements IMiddleware {
  attach(express: Application): Application {
    express.use(Cors({
      origin: '*',
      methods: 'GET,POST',
      preflightContinue: false,
      optionsSuccessStatus: 200
    }));
    return express;
  }
}