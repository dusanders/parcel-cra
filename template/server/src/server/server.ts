import express, { Application } from "express";
import * as Https from 'https';
import * as Http from 'http';
import { IHandleApi, IMiddleware } from "../middleware/middleware.def";
import { IConfiguration, ConfigurationFactory } from "../services/config/config.def";
import { IServer } from "./server.def";

/**
 * Implement the Server contract.
 * 
 * NOTE: must initialize the server with a proper configuration
 */
export class Server implements IServer {
  /**
   * Create an instance according to the configuration
   * @param config configuration object
   * @returns 
   */
  static fromConfiguration(config: IConfiguration): IServer {
    let expressApp = express();
    let http: Https.Server | Http.Server | undefined;
    if (ConfigurationFactory.isSecureConfiguration(config)) {
      http = Https.createServer({
        key: config.sslKey,
        cert: config.sslCert
      }, expressApp);
    } else if (ConfigurationFactory.isConfiguration(config)) {
      http = Http.createServer(expressApp);
    } else {
      throw new Error(`Invalid configuration - cannot create server instance`);
    }
    return new Server(http, expressApp, config);
  }
  
  private express: Application;
  private node: Https.Server | Http.Server;
  private configuration: IConfiguration;

  private constructor(node: Http.Server | Https.Server, express: Application,
    config: IConfiguration) {
    this.node = node;
    this.express = express;
    this.configuration = config;
  }
  addApiHandler(handler: IHandleApi): IServer {
    handler.listenForRoutes(this.express);
    return this;
  }
  addMiddleware(middleware: IMiddleware): IServer {
    middleware.attach(this.express);
    return this;
  }
  stop(): void {
    this.node?.close();
  }
  start(): Promise<IServer> {
    return new Promise((resolve) => {
      this.node.listen(this.configuration.port, () => {
        console.log(`server listening on ${this.configuration.port}`);
        resolve(this);
      });
    });
  }
}