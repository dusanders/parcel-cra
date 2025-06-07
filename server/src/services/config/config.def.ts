import * as fs from 'fs-extra';

export interface IConfigureDatabase {
  connection: string;
  secret: string;
}

export interface IConfiguration {
  port: number;
  www: string;
  database: IConfigureDatabase;
  sslKey?: string;
  sslCert?: string;

}
export class ConfigurationFactory {
  static async fromFile(file: string): Promise<IConfiguration> {
    await fs.stat(file);
    let json = fs.readJSONSync(file);
    return ConfigurationFactory.fromJson(json);
  }
  static fromJson(json: any): IConfiguration {
    if (ConfigurationFactory.isSecureConfiguration(json)) {
      return json as IConfiguration;
    }
    if (ConfigurationFactory.isConfiguration(json)) {
      return json as IConfiguration;
    }
    throw new Error(`Invalid json`);
  }
  static isConfiguration(body: IConfiguration | unknown): body is IConfiguration {
    let valid = body as IConfiguration;
    return valid.port !== undefined && Boolean(valid.database);
  }
  static isSecureConfiguration(body: IConfiguration | unknown): body is IConfiguration {
    let valid = body as IConfiguration;
    return valid.sslCert !== undefined
      && valid.sslKey !== undefined
      && Boolean(valid.database);
  }
}