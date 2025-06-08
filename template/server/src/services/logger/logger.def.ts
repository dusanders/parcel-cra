
/**
 * Define the contract for the logger service
 */
export interface ILogger {
  /**
   * Log Information
   * @param tag 
   * @param message 
   */
  i(tag: string, message: string): void;
  /**
   * Log debug
   * @param tag 
   * @param message 
   */
  d(tag: string, message: string): void;
  /**
   * Log warn
   * @param tag 
   * @param message 
   */
  w(tag: string, message: string): void;
  /**
   * Log error
   * @param tag 
   * @param message 
   */
  e(tag: string, message: string): void;
}