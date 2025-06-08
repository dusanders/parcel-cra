
export interface ILogger {
  info(tag: string, message: string): void;
  debug(tag: string, message: string): void;
  warn(tag: string, message: string): void;
  error(tag: string, message: string): void;
}

export const Log: ILogger = {
  info: (tag, message) => console.info(`${tag} :: ${message}`),
  debug: (tag, message) => console.debug(`${tag} :: ${message}`),
  warn: (tag, message) => console.warn(`${tag} :: ${message}`),
  error: (tag, message) => console.error(`${tag} :: ${message}`)
}