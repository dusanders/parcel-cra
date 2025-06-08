import * as fs from 'fs-extra';

/**
 * Define contract for database configuration
 */
export interface IConfigureDatabase {
  connection: string;
  secret: string;
}

/**
 * Define contract for server configuration
 */
export interface IConfiguration {
  port: number;
  www: string;
  database: IConfigureDatabase;
  sslKey?: string;
  sslCert?: string;

}

/**
 * Basic configuration factory implementation
 */
export class ConfigurationFactory {
  /**
   * Configure based on a JSON file
   * @param file 
   * @returns 
   */
  static async fromFile(file: string): Promise<IConfiguration> {
    await fs.stat(file);
    let json = fs.readJSONSync(file);
    return ConfigurationFactory.fromJson(json);
  }
  /**
   * Configure based on a JSON object
   * @param json 
   * @returns 
   */
  static fromJson(json: any): IConfiguration {
    if (ConfigurationFactory.isSecureConfiguration(json)) {
      return json as IConfiguration;
    }
    if (ConfigurationFactory.isConfiguration(json)) {
      return json as IConfiguration;
    }
    throw new Error(`Invalid json`);
  }
  /**
   * Validate a configuration
   * @param body 
   * @returns 
   */
  static isConfiguration(body: IConfiguration | unknown): body is IConfiguration {
    let valid = body as IConfiguration;
    return valid.port !== undefined && Boolean(valid.database);
  }
  /**
   * Validate a configuration that has SSL key & cert
   * @param body 
   * @returns 
   */
  static isSecureConfiguration(body: IConfiguration | unknown): body is IConfiguration {
    let valid = body as IConfiguration;
    return valid.sslCert !== undefined
      && valid.sslKey !== undefined
      && Boolean(valid.database);
  }
}