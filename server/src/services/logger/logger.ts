import { ILogger } from "./logger.def";

export const Log: ILogger = {
  i(tag: string, message: string) {
    console.info(`${tag} :: ${message}`);
  },
  d(tag: string, message: string) {
    console.debug(`${tag} :: ${message}`);
  },
  w(tag: string, message: string) {
    console.warn(`${tag} :: ${message}`);
  },
  e(tag: string, message: string) {
    console.error(`${tag} :: ${message}`);
  }
}