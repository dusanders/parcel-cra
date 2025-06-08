import { ILogger } from "./logger.def";

/**
 * Implement the logger contract
 * 
 * NOTE: Use a `const` to act as static class
 */
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