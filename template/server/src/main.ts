import { IServer } from "./server/server.def";
import { ConfigurationFactory, IConfiguration } from "./services/config/config.def";
import { CorsMiddleware } from "./middleware/cors";
import { JsonMiddleware } from "./middleware/json";
import { JWTService } from "./services/auth/jwt/jwt";
import { StaticMiddleware } from "./middleware/static";
import { AuthenticationService } from "./services/auth/auth";
import { AuthHandler } from "./middleware/api/auth";
import { UserHandler } from "./middleware/api/user";
import { Server } from "./server/server";
import { JsonDatabase } from "./services/database/json/json";

/**
 * Class to handle all application logic: start / stop server, etc
 */
class Main {
  private server?: IServer;
  /**
   * Start the server
   * @param configuration 
   */
  async start(configuration: IConfiguration) {
    console.log(`Start ${configuration.port}`);

    const database = await JsonDatabase.fromFile(configuration.database.secret);
    const jwtService = new JWTService();
    const authService = new AuthenticationService(jwtService);

    this.server = await Server.fromConfiguration(configuration)
      .addMiddleware(new CorsMiddleware())
      .addMiddleware(new JsonMiddleware())
      .addApiHandler(new AuthHandler(authService))
      .addApiHandler(new UserHandler(database, authService))
      .addMiddleware(new StaticMiddleware(configuration.www))
      .start();
  }
  /**
   * Stop the server
   */
  stop() {
    this.server?.stop();
  }
  /**
   * Create the required Configuration contract to start a IServer
   * @param configFile 
   * @returns 
   */
  async configure(configFile: string): Promise<IConfiguration> {
    return await ConfigurationFactory.fromFile(configFile);
  }
}

/**
 * Allow this server to be imported or launched via Node
 * // We check for a process arg and see if that is a config file,
 * // otherwise we just console log
 */
const main = new Main();
let cmdConfig = process.argv.slice(2)[0] || '';
if (cmdConfig) {
  main.configure(process.argv.slice(2)[0] || '').then((configuration) => {
    main.start(configuration);
  });
} else {
  console.warn(`Not starting - no config passed: ${cmdConfig} of ${JSON.stringify(process.argv)}`);
}

/**
 * Export for possible import into other node app
 */
module.exports = {
  start: (configFile: string) => {
    main.configure(configFile).then((configuration) => {
      main.start(configuration);
    });
  },
  stop: () => {
    main.stop();
  }
}