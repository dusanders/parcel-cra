import { Application } from "express";
import { IMiddleware } from "./middleware.def";
import Cors from 'cors';

/**
 * Middleware to handle Cors requests/responses
 */
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